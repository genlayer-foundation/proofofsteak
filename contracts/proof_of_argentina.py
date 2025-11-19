# v0.1.0
# { "Depends": "py-genlayer:latest" }
from genlayer import *
from dataclasses import dataclass

import json

# Category definitions with descriptions
CATEGORIES = {
    "steak": "any cooked beef cut, grilled meat, sliced beef, steak of ANY quality or condition",
    "veggies": "vegetarian dishes or plant-based substitutes",
    "mate": "mate gourd, bombilla, yerba mate, medialunas, facturas, dulce de leche",
    "gaucho": "horses, ponchos, boleadoras, gaucho clothing, tango dancers, bandoneon",
    "futbol": "soccer balls, goals, pitches, jerseys, players",
    "easter_eggs": "only if NONE of the above objects are visible"
}

CATCH_ALL_CATEGORY = "easter_eggs"

@allow_storage
@dataclass
class AnalysisRecord:
    id: str
    consensus_output: str
    caller_address: Address
    defense: str = ""
    original_url: str = ""        # Full-resolution original
    leaderboard_url: str = ""     # 1000x1000 square thumbnail
    analysis_url: str = ""        # 1024px max for AI analysis
    name: str = ""
    location: str = ""
    score: u32 = 0

class ImageAnalyzer(gl.Contract):
    # Single TreeMap with category names as keys
    analyses_by_category: TreeMap[str, DynArray[AnalysisRecord]]
    # ID lookup map
    analyses_by_id: TreeMap[str, AnalysisRecord]

    def __init__(self):
        # Initialize all categories with empty arrays
        for category in CATEGORIES:
            self.analyses_by_category[category] = []

    def _get_category_array(self, category: str) -> DynArray[AnalysisRecord]:
        """Get the appropriate storage array for a category"""
        # Validate category exists, fallback to catch-all
        if category in CATEGORIES:
            return self.analyses_by_category[category]
        else:
            return self.analyses_by_category[CATCH_ALL_CATEGORY]

    def _get_score(self, consensus_output: str) -> int:
        """Extract score from consensus_output JSON string"""
        try:
            data = json.loads(consensus_output)
            return data.get("score", 0)
        except (json.JSONDecodeError, KeyError, AttributeError):
            return 0

    @gl.public.write
    def analyze_image(self, id: str, original_url: str, leaderboard_url: str, analysis_url: str,
                      defense: str = "", name: str = "", location: str = "") -> None:
        def non_det():
            try:
                # Step 1: Get objective image description and category analysis
                web_data = gl.nondet.web.render(analysis_url, mode="screenshot")

                # Build categories section dynamically from CATEGORIES constant
                categories_text = "\n".join([f'                - "{cat}": {desc}' for cat, desc in CATEGORIES.items()])

                analysis_prompt = f"""
                You are a neutral, extremely objective image analyst.

                Your task:
                1) Identify which ONE category the image belongs to, based ONLY on visible objects.
                2) Describe, in precise and factual detail, the object(s) in the image that match that category.
                Never beautify or idealize. Describe exactly what is there, including defects (worms, mold, burnt areas, odd textures, damage, contamination, etc.).

                -------------------------------------
                CATEGORIES (CHOOSE EXACTLY ONE)
                -------------------------------------
                - "steak":
                Any beef-based main dish or preparation.
                Examples: grilled steak, asado/parrilla meat, sliced steak on a board or plate, bife de chorizo, entraña, vacío, milanesa de carne, hamburgers clearly made of beef, steak sandwiches where the steak is clearly visible.

                - "veggies":
                Vegetarian or vegan main dishes where vegetables or plant-based foods are the main element and NO visible meat.
                Examples: vegetarian empanadas, salads as the main dish, grilled vegetables as a main plate, plant-based burgers or steaks, tofu, seitan, veggie milanesa, quinoa bowls.
                If the image shows a prepared dish of food on a plate, bowl, or similar, and it is clearly plant-based with no visible meat, classify it as "veggies" and not "easter_eggs".

                - "mate":
                Mate and Argentine pastries/sweets.
                Examples: mate gourd with bombilla, yerba mate, thermos used for mate; medialunas, facturas, alfajores, cakes with dulce de leche, jars or spreads of dulce de leche, other clearly Argentine-style pastries typically seen with mate.

                - "gaucho":
                Gaucho and tango culture.
                Examples: gauchos, horses with riders in traditional clothing, ponchos, boleadoras, wide-brimmed hats, boots; tango dancers, bandoneon, milonga scenes, tango shows with characteristic outfits.
                Typical gaucho elements: bombachas (loose riding trousers), alpargatas or riding boots; poncho or chiripá, wide cloth belts, facón (large knife); beret/boina or gaucho hat, horses in rural Pampas-style settings; mate in a rural context
                Typical tango elements: tango dancers in close embrace, elegant dresses and suits; bandoneon, milonga or stage tango scenes, Buenos Aires-style streets
                - "futbol":
                Football/soccer objects or scenes. Ball appearance (panels, wear, logos), jerseys (colors, patterns, visible crests or emblems), numbers, field/grass details, stadium or crowd elements directly tied to football. Any visible logos, flags, emblems, or readable text (team names, country names, city names, brands, club crests, words on shirts or banners), described or transcribed exactly as seen (e.g. "text ESPAÑA", "red and yellow striped flag", "FC Barcelona logo")
                Examples: footballs, goals, pitches, stadiums, players, referees, football jerseys, crowds clearly watching a football match.

                - "easter_eggs":
                Use ONLY if none of the above clearly apply.
                Any other content: landscapes, random people, cars, buildings, non-football sports, generic objects.
                Do NOT use "easter_eggs" for prepared food dishes that can reasonably fit "steak", "veggies", or "mate".

                IMPORTANT:
                - Category is based ONLY on object type, NOT on quality, origin, or whether it looks “Argentine”.
                - A rotten, burnt, moldy, infested steak is STILL "steak".
                - A non-Argentine football scene is STILL "futbol".
                - For food images: first decide if it is "steak", then if it is "veggies" (plant-based, no visible meat), then if it is "mate" (mate/pastries). Only if none of these apply may you use "easter_eggs".
                - If more than one category could apply, choose the category that best matches the main or most visually dominant subject of the image.
                - for food (steak, veggies, mate/pastries):
                    - cooking/preparation state (raw, rare, medium-rare, overcooked, burnt, etc.)
                    - surface details: grill marks, fat, sauces, crumbs, glaze, seeds, herbs
                    - internal details if visible: color of the inside, juices, layers, fillings
                    - contamination / foreign objects:
                        • explicitly look for and describe any worms, insects, larvae, mold spots, unusual dots or patches, hair, plastic, dirt, or other non-food fragments
                        • if something might be contamination, describe its shape, color, and location neutrally (e.g. “thin white curved shapes on the surface”) instead of assuming it is garnish
                    - plating/presentation: plate, board, napkin, sauces around it, liquids on the surface

                -------------------------------------
                OUTPUT FORMAT (STRICT)
                -------------------------------------

                STEP 1 — CATEGORY
                CATEGORY: "steak" | "veggies" | "mate" | "gaucho" | "futbol" | "easter_eggs"

                STEP 2 — OBJECT DESCRIPTION
                (Describe ONLY the objects that match the chosen CATEGORY. Ignore unrelated elements except when needed as immediate context.)

                MATCHING_ITEMS:
                - For each relevant object, provide:
                - NAME: short label for the object (e.g. "grilled steak", "mate gourd", "soccer ball", "tango couple").
                - LOCATION: where it appears in the image (e.g. "center foreground", "top-right", "left side on a table").
                - VISIBLE_DETAILS:
                    • overall shape and structure  
                    • main colors and visible color variations  
                    • materials (meat, bread, ceramic, metal, leather, fabric, grass, etc.)  
                    • textures (smooth, rough, crispy, charred, creamy, foamy, grainy, fatty, wet, dry, worn, dirty, etc.)  
                    • condition and defects (burnt edges, undercooked areas, worms, insects, mold, cracks, stains, damage, distortion, wear)  
                    • for food: cooking/preparation state (raw, medium-rare, overcooked, sliced, sauced, filled, frosted, etc.) and plating/presentation  
                    • for mate/pastries: shape and fill of pastries, visible layers, sugar, glaze, amount of yerba, position of bombilla, cup material  
                    • for gaucho/tango: clothing details (poncho, boots, hats, dresses), posture, instruments, horses, movement cues  
                    • for futbol: ball appearance (panels, wear, logos), jerseys (colors, patterns, visible crests or emblems), numbers, field/grass details, stadium or crowd elements directly tied to football  
                    • any visible logos, flags, emblems, or readable text (team names, country names, city names, brands, club crests, words on shirts or banners), described or transcribed exactly as seen  
                    • any other visually important traits directly related to the category object
                - CATEGORY_REASON: short explanation of why this object clearly fits the chosen CATEGORY based ONLY on visible traits.

                -------------------------------------
                RULES
                -------------------------------------
                - Be brutally factual and defect-aware. Never omit flaws or problems you can see.
                - Do not guess nationality or origin. Only mention it when there is a clear visual cue (e.g. a Spanish flag, the word "España", a recognizable team crest) and describe it exactly as seen.
                - Do NOT mention Argentina, “Argentine”, or scoring in this prompt.
                - Do NOT describe irrelevant background objects in detail; focus on the category objects and their immediate context.
                - Do NOT invent objects or details that are not clearly visible.
                """
                result = gl.nondet.exec_prompt(analysis_prompt, images=[web_data])
                return result.strip()

            except Exception as e:
                return f"""
CATEGORY_PRESENCE: not_present

EXPLANATION:
Error loading or analyzing the image: {str(e)}. Unable to perform image analysis due to technical issues with image access or processing.
                """.strip()

        TASK_PROMPT = f"""
You are a rigorous, objective, mildly humorous AI jury specialized in evaluating how well an image represents Argentine culture.

INPUTS:
- IMAGE_ANALYSIS: a structured description that includes:
  - category: "steak" | "veggies" | "mate" | "gaucho" | "futbol" | "easter_eggs"
  - detailed descriptions of the main object(s) matching that category
- USER_DEFENSE: the user’s explanation of what the image is and how it relates to Argentina.

The defense provided by the user is the following:
{defense}

Use IMAGE_ANALYSIS as the ground truth for what is visible. Do not contradict it or change the category. Use USER_DEFENSE only as extra context and ignore it if it clearly contradicts what is visible.

Your task:
1) Copy the category exactly from IMAGE_ANALYSIS.
2) Decide how strongly the image is connected to Argentina.
3) Give a precise score from 0 to 1000.
4) Provide a short explanation, factual first, with light humor and optional emojis.

GENERAL RULES
- If there is no credible Argentine connection (neither in IMAGE_ANALYSIS nor in USER_DEFENSE), score must be 0.
- Once a credible Argentine connection exists, focus mainly on the quality, clarity, and strength of the representation for that category.
- Do not require obvious symbols (flags, logos, landmarks) for food categories if USER_DEFENSE gives a believable Argentine context and nothing contradicts it.
- USER_DEFENSE cannot invent objects that are not in IMAGE_ANALYSIS, but it can establish location or context (e.g. saying the steak is from an Argentine restaurant).

ARGENTINE RELEVANCE BY CATEGORY

steak:
- Treat as Argentine if USER_DEFENSE or IMAGE_ANALYSIS mentions Argentina, an Argentine city/region, an Argentine restaurant/asado, or typical Argentine cut names.
- Do NOT penalize for missing flags, parrilla, or clichés if the steak itself looks good and the context is plausibly Argentine.

veggies:
- Vegetarian or vegan dishes with a believable Argentine context (defense or description mentioning Argentina, Argentine dish names, or an Argentine setting).

mate:
- Automatically Argentine if IMAGE_ANALYSIS shows mate, medialunas, facturas, alfajores, dulce de leche or similar pastries/snacks.
- USER_DEFENSE can reinforce but is not required.

gaucho:
- Gaucho-style clothing, horses, rural scenes or tango elements that can plausibly be Argentine. Defense can help tie it to Argentina if needed.

futbol:
- Only treat as Argentine if IMAGE_ANALYSIS or USER_DEFENSE refers to clearly Argentine elements: AFA, Argentina NT, Boca, River, Argentine club names, Argentine flag, or explicit Argentine text.
- Colors or generic football visuals alone are NOT enough. If another country/team is mentioned, score must be 0.

easter_eggs:
- Any other content that still has a believable Argentine link through flags, landmarks, text, or USER_DEFENSE.
- If no such link, score = 0.

SCORING

If no credible Argentine link → score = 0.

If there is a credible Argentine link, assign a score from 1 to 1000 based on:

- Quality and condition of the main object(s) (good steak, well-poured mate, clear tango scene, etc.).
- Clarity and visibility (is the relevant content easy to see and understand?).
- How strongly it represents the chosen category (a textbook steak vs. a weak/unclear one).
- Strength and specificity of the Argentine connection (generic “Argentina” < very specific story or setting).
- Negative factors (contamination, worms, mold, very poor quality, misleading representation, etc.).

Use the full 0–1000 range. Small differences in quality/relevance should give small numeric differences (e.g. 953 vs 955). Excellent, clearly Argentine, well-shot examples should land high (e.g. 800–1000). Average but clearly Argentine examples should land mid-range, not near zero.

STYLE FOR REASONING
- Be concise and grounded in IMAGE_ANALYSIS and USER_DEFENSE.
- Mention both the visual quality and the Argentine link.
- Light humor and emojis are allowed, but do not undermine the factual judgment or the score.
- Do not say the image “doesn’t fit the main categories”; the category from IMAGE_ANALYSIS is always used as-is.

OUTPUT FORMAT
Return ONLY valid JSON:

{{
  "category": "steak" | "veggies" | "mate" | "gaucho" | "futbol" | "easter_eggs",
  "score": <integer between 0 and 1000>,
  "reasoning": "Short objective explanation with light humor and optional emojis."
}}

"""

        consensus_output = gl.eq_principle.prompt_non_comparative(
            non_det,
            task=TASK_PROMPT,
            criteria="The scoring should consistently reflect the category match determination from the analysis, provide appropriate scores based on quality and authenticity, and include entertaining reasoning with emojis and humor"
        )

        # Step 3: Store consensus result in category-specific array
        caller_address = gl.message.sender_address

        # Use the ID provided by the caller (generated in frontend)
        record_id = id

        # Parse category and score from consensus output
        try:
            consensus_json = json.loads(consensus_output)
            determined_category = consensus_json.get("category", CATCH_ALL_CATEGORY)
            score = consensus_json.get("score", 0)

            # Validate category exists, fallback to catch-all
            if determined_category not in CATEGORIES:
                determined_category = CATCH_ALL_CATEGORY

            # Create record with parsed score
            record = AnalysisRecord(record_id, consensus_output, caller_address, defense,
                                   original_url, leaderboard_url, analysis_url,
                                   name, location, score)

            # Store in ID lookup map
            self.analyses_by_id[record_id] = record

            # Insert sorted by score (descending order)
            category_array = self.analyses_by_category[determined_category]

            # Find the correct position to insert (descending order - highest score first)
            insert_index = None
            for i in range(len(category_array)):
                existing_record = category_array[i]
                existing_score = existing_record.score
                if score > existing_score:
                    insert_index = i
                    break

            # Insert at the correct position or append to end
            if insert_index is not None:
                category_array.insert(insert_index, record)
            else:
                # New score is lowest or array is empty - append to end
                category_array.append(record)

        except (json.JSONDecodeError, KeyError):
            # If parsing fails, store in catch-all category with score 0
            score = 0
            record = AnalysisRecord(record_id, consensus_output, caller_address, defense,
                                   original_url, leaderboard_url, analysis_url,
                                   name, location, score)

            # Store in ID lookup map
            self.analyses_by_id[record_id] = record

            category_array = self.analyses_by_category[CATCH_ALL_CATEGORY]

            # Find the correct position to insert (descending order)
            insert_index = None
            for i in range(len(category_array)):
                existing_record = category_array[i]
                existing_score = existing_record.score
                if score > existing_score:
                    insert_index = i
                    break

            # Insert at the correct position or append to end
            if insert_index is not None:
                category_array.insert(insert_index, record)
            else:
                # New score is lowest or array is empty - append to end
                category_array.append(record)

    @gl.public.view
    def get_analysis_by_category(self, category: str, start_index: int = 0, count: int = 10) -> dict:
        """Get analyses for a given category with pagination (pre-sorted by score)"""
        category_array = self._get_category_array(category)

        # Validate parameters
        if start_index < 0:
            start_index = 0
        if count <= 0:
            count = 10
        if count > 10:
            count = 10  # Enforce maximum 10 items per request

        # Array is already sorted (by negative score), just paginate
        total_count = len(category_array)
        end_index = min(start_index + count, total_count)

        # Convert requested slice to list of dicts
        records = []
        for i in range(start_index, end_index):
            record = category_array[i]
            rank = i + 1  # Global rank (1-indexed, position in sorted array)

            records.append({
                "id": record.id,
                "consensus_output": record.consensus_output,
                "caller_address": record.caller_address.as_hex,
                "defense": record.defense,
                "original_url": record.original_url,
                "leaderboard_url": record.leaderboard_url,
                "analysis_url": record.analysis_url,
                "name": record.name,
                "location": record.location,
                "score": record.score,
                "rank": rank
            })

        return {
            "records": records,
            "total_count": total_count,
            "start_index": start_index,
            "returned_count": len(records),
            "has_more": end_index < total_count
        }

    @gl.public.view
    def get_analysis_by_id(self, id: str) -> dict:
        """Get a single analysis record by its ID, searching all categories"""
        # Look up the record in the ID map
        if id not in self.analyses_by_id:
            return {}

        record = self.analyses_by_id[id]

        # Find which category this record belongs to and its rank
        found_category = None
        rank = None

        for category in CATEGORIES.keys():
            category_array = self._get_category_array(category)
            for i in range(len(category_array)):
                if category_array[i].id == id:
                    found_category = category
                    rank = i + 1
                    break
            if found_category:
                break

        # Return the record details with category
        return {
            "id": record.id,
            "category": found_category if found_category else "easter_eggs",
            "consensus_output": record.consensus_output,
            "caller_address": record.caller_address.as_hex,
            "defense": record.defense,
            "original_url": record.original_url,
            "leaderboard_url": record.leaderboard_url,
            "analysis_url": record.analysis_url,
            "name": record.name,
            "location": record.location,
            "score": record.score,
            "rank": rank if rank is not None else 0
        }

    @gl.public.view
    def get_analysis_by_wallet(self, wallet_address: str, start_index: int = 0, count: int = 10) -> dict:
        """Get analyses for a given wallet address with pagination, sorted by score"""
        # Validate parameters
        if start_index < 0:
            start_index = 0
        if count <= 0:
            count = 10
        if count > 10:
            count = 10  # Enforce maximum 10 items per request

        # Collect all records from all categories for the specified wallet
        all_records = []

        for category in CATEGORIES.keys():
            category_array = self._get_category_array(category)
            for record in category_array:
                if record.caller_address.as_hex == wallet_address:
                    all_records.append(record)

        # Sort by score descending (highest first)
        all_records.sort(key=lambda x: x.score, reverse=True)

        total_count = len(all_records)
        end_index = min(start_index + count, total_count)

        # Convert requested slice to list of dicts
        records = []
        for i in range(start_index, end_index):
            record = all_records[i]
            rank = i + 1  # Global rank (1-indexed, position in sorted array)

            # Find which category this record belongs to
            found_category = "easter_eggs"
            for category in CATEGORIES.keys():
                category_array = self._get_category_array(category)
                for cat_record in category_array:
                    if cat_record.id == record.id:
                        found_category = category
                        break
                if found_category != "easter_eggs":
                    break

            records.append({
                "id": record.id,
                "category": found_category,
                "consensus_output": record.consensus_output,
                "caller_address": record.caller_address.as_hex,
                "defense": record.defense,
                "original_url": record.original_url,
                "leaderboard_url": record.leaderboard_url,
                "analysis_url": record.analysis_url,
                "name": record.name,
                "location": record.location,
                "score": record.score,
                "rank": rank
            })

        return {
            "records": records,
            "total_count": total_count,
            "start_index": start_index,
            "returned_count": len(records),
            "has_more": end_index < total_count
        }

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

                Your task has two goals:
                1) Identify which category the image belongs to based ONLY on visible objects.
                2) Describe the matching object(s) in precise, factual, defect-aware detail.
                Never beautify or idealize. Describe what is actually there (including worms, mold, burnt areas, odd textures, contamination, etc.).

                CATEGORIES:
{categories_text}

                IMPORTANT:
                - Classification depends ONLY on object type, NOT quality.
                - A rotten, burnt, moldy, infested steak is STILL “steak.”
                - Never ignore or soften defects. Describe them fully.

                -------------------------------------
                OUTPUT FORMAT
                -------------------------------------

                STEP 1 — CATEGORY  
                CATEGORY: "steak" | "veggies" | "mate" | "gaucho" | "futbol" | "easter_eggs"

                STEP 2 — CATEGORY_PRESENCE  
                "present" | "not_present" | "uncertain"

                STEP 3 — OBJECT DESCRIPTION  
                (Describe ONLY objects matching the category.)

                If CATEGORY_PRESENCE = "present":
                - MATCHING_ITEMS:
                - NAME: short label
                - LOCATION: where it appears (e.g. “center,” “top-left”)
                - VISIBLE_DETAILS: 
                    • shape and structure  
                    • color and color variations  
                    • textures (including irregularities, burnt spots, dryness, moisture, fat content, contamination)  
                    • defects or abnormalities (worms, mold, insects, rot, unusual coloration, foreign objects)  
                    • preparation state (raw, overcooked, charred, damaged, sliced)  
                    • surrounding context directly interacting with the object  
                - CATEGORY_REASON: why the object fits the chosen category based on visible traits

                If CATEGORY_PRESENCE = "uncertain":
                - POSSIBLE_MATCHES:
                - NAME
                - LOCATION
                - VISIBLE_DETAILS
                - UNCERTAINTY_REASON

                If CATEGORY_PRESENCE = "not_present":
                - EXPLANATION: factual description of what is visible instead.

                -------------------------------------
                RULES
                -------------------------------------
                - Be brutally factual and defect-aware. Never omit flaws.
                - No assumptions. No idealization. No cultural judgments.
                - Only describe what is visually present.
                - Do not describe irrelevant objects.
                - Do not mention scoring.
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
You are a rigorous but lightly humorous AI jury evaluating Argentine cultural content in images.

INPUTS:
1) IMAGE_ANALYSIS (already includes the category and objective description)
2) USER_DEFENSE: {defense}

YOUR TASK:
- Use ONLY the category and facts from IMAGE_ANALYSIS.
- Decide if the category has valid matches in the image.
- Produce a precise score from 0 to 1000.
- Provide a short, witty explanation that stays grounded in reality.
- Humor is allowed, exaggeration is NOT. Never inflate scores for clearly bad or low-quality items.

------------------------------------------------
CATEGORY MATCH
------------------------------------------------
has_match = true  
IF IMAGE_ANALYSIS shows CATEGORY_PRESENCE = "present" with clear visible items.

has_match = false  
IF CATEGORY_PRESENCE = "not_present", "uncertain", or category = "easter_eggs".

USER_DEFENSE has no power to change has_match.

------------------------------------------------
SCORING RULES (Objective → then flavored with light humor)
------------------------------------------------

If has_match = false:
- If category = "easter_eggs" and no Argentine content exists → score = 0
- Otherwise → score between 1 and 300 depending on how close or tangential the content is.

If has_match = true:
Score must reflect:
- clarity and visibility of the item
- authenticity (does it genuinely fit Argentine culture?)
- quality and condition (good steak = high score; steak with worms = very low)
- relevance and centrality
- user defense quality (boosts or lowers slightly, but never overrides reality)

Use any integer between 1 and 1000.  
Never give high scores to bad, rotten, contaminated, misleading, or degraded items.

------------------------------------------------
STYLE RULES
------------------------------------------------
- Be concise, factual, and lightly humorous (short jokes, subtle puns, occasional emojis).
- No chaotic or over-the-top comedy.
- Never hide flaws detected in IMAGE_ANALYSIS.
- Never praise low-quality items ironically.
- Reasoning must reflect the true state of the object.

------------------------------------------------
OUTPUT FORMAT (STRICT)
------------------------------------------------
Return ONLY valid JSON:

{{
  "category": "<category>",
  "has_match": true or false,
  "score": <integer>,
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
    def get_analysis_by_id(self, category: str, id: str) -> dict:
        """Get a single analysis record by its ID"""
        # Look up the record in the ID map
        if id not in self.analyses_by_id:
            return {}

        record = self.analyses_by_id[id]

        # Find the rank by looking up position in category array
        category_array = self._get_category_array(category)
        rank = None
        for i in range(len(category_array)):
            if category_array[i].id == id:
                rank = i + 1
                break

        # Return the record details
        return {
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
            "rank": rank if rank is not None else 0
        }

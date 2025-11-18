# v0.1.0
# { "Depends": "py-genlayer:latest" }
from genlayer import *

import json

@allow_storage
class AnalysisRecord:
    def __init__(self, consensus_output: str, caller_address: Address, defense: str = "", url: str = ""):
        self.consensus_output = consensus_output
        self.caller_address = caller_address
        self.defense = defense
        self.url = url

class ImageAnalyzer(gl.Contract):
    # Category-specific storage arrays
    steak_analyses: DynArray[AnalysisRecord]
    veggies_analyses: DynArray[AnalysisRecord]
    mate_analyses: DynArray[AnalysisRecord]
    gaucho_analyses: DynArray[AnalysisRecord]
    futbol_analyses: DynArray[AnalysisRecord]
    easter_eggs_analyses: DynArray[AnalysisRecord]

    def __init__(self):
        self.steak_analyses = []
        self.veggies_analyses = []
        self.mate_analyses = []
        self.gaucho_analyses = []
        self.futbol_analyses = []
        self.easter_eggs_analyses = []

    def _get_category_array(self, category: str) -> DynArray[AnalysisRecord]:
        """Get the appropriate storage array for a category"""
        if category == "steak":
            return self.steak_analyses
        elif category == "veggies":
            return self.veggies_analyses
        elif category == "mate":
            return self.mate_analyses
        elif category == "gaucho":
            return self.gaucho_analyses
        elif category == "futbol":
            return self.futbol_analyses
        else:  # easter-eggs or default
            return self.easter_eggs_analyses

    @gl.public.write
    def analyze_image(self, url: str, defense: str = "") -> None:
        def non_det():
            try:
                # Step 1: Get objective image description and category analysis
                web_data = gl.nondet.web.render(url, mode="screenshot")

                analysis_prompt = f"""
                You are a neutral, extremely objective image analyst.

                Your task has two goals:
                1) Identify which category the image belongs to based ONLY on visible objects.
                2) Describe the matching object(s) in precise, factual, defect-aware detail. 
                Never beautify or idealize. Describe what is actually there (including worms, mold, burnt areas, odd textures, contamination, etc.).

                CATEGORIES:
                - "steak": any cooked beef cut, grilled meat, sliced beef, steak of ANY quality or condition.
                - "veggies": vegetarian dishes or plant-based substitutes.
                - "mate": mate gourd, bombilla, yerba mate, medialunas, facturas, dulce de leche.
                - "gaucho": horses, ponchos, boleadoras, gaucho clothing, tango dancers, bandoneon.
                - "futbol": soccer balls, goals, pitches, jerseys, players.
                - "easter_eggs": only if NONE of the above objects are visible.

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
        record = AnalysisRecord(consensus_output, caller_address, defense, url)

        # Parse category and score from consensus output to determine storage
        try:
            consensus_json = json.loads(consensus_output)
            determined_category = consensus_json.get("category", "easter_eggs")
            score = consensus_json.get("score", 0)

            # Store based on category determined by LLM
            if determined_category == "easter_eggs":
                self.easter_eggs_analyses.append(record)
            else:
                # Store in specific category array (steak, veggies, mate, gaucho, futbol)
                category_array = self._get_category_array(determined_category)
                category_array.append(record)
        except (json.JSONDecodeError, KeyError):
            # If parsing fails, store in easter_eggs
            self.easter_eggs_analyses.append(record)

    @gl.public.view
    def get_analysis_by_category(self, category: str, start_index: int = 0, count: int = 10) -> dict:
        """Get analyses for a given category with pagination"""
        category_array = self._get_category_array(category)
        total_count = len(category_array)

        # Validate parameters
        if start_index < 0:
            start_index = 0
        if count <= 0:
            count = 10

        end_index = min(start_index + count, total_count)

        # Convert requested slice to list of dicts
        records = []
        for i in range(start_index, end_index):
            record = category_array[i]
            records.append({
                "consensus_output": record.consensus_output,
                "caller_address": record.caller_address.as_hex,
                "defense": record.defense,
                "url": record.url
            })

        return {
            "records": records,
            "total_count": total_count,
            "start_index": start_index,
            "returned_count": len(records),
            "has_more": end_index < total_count
        }
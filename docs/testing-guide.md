# Testing Guide & Example Scenarios 🧪

Use this guide to verify your Berlin Club Bouncer agent is working correctly. We've outlined specific scenarios to test the logic, routing, and personality of your agent.

## 📸 Where to Find Test Photos

You don't need to dress up for every test! Use these resources:
- **Unsplash/Pexels**: Search for "techno party", "rave fashion", "leather outfit", "festival crowd".
- **Google Images**: Search for specific styles (e.g., "Berghain outfit", "KitKat club fashion").
- **Your Camera Roll**: Dig up old party photos!

---

## 1. Wrapper Logic Tests (The "Bouncer at the Door")

These tests verify the initial validation logic before the specific club judge sees the photo.

### Scenario A: The "Ghost" (No People)
- **Input**: A photo of an empty room, a chair, or just clothes on a bed.
- **Club**: Any
- **Expected Result**: **REJECT**
- **Why**: The `AI Vision - Photo Content Check` node should detect `peopleCount: 0`.
- **Expected Message**: "No humans detected. Try partying with your coat rack instead."

### Scenario B: The "Hidden Outfit" (Group)
- **Input**: A group selfie where only faces are visible, or people standing behind a bar/wall.
- **Club**: Any
- **Expected Result**: **REJECT**
- **Why**: The `AI Vision` node should return `allOutfitsVisible: false`.
- **Expected Message**: "Not all outfits are visible; can't judge invisible fashion!"

### Scenario C: The "Tourist Bus" (Berghain Group Rule)
- **Input**: A photo of 3 or more people.
- **Club**: **Berghain**
- **Expected Result**: **REJECT** (Immediate)
- **Why**: The `Function - Validate Photo` node checks `peopleCount > 2` AND `club === 'Berghain'`.
- **Expected Message**: "Berghain bans parties of 3+. Better luck next time."

---

## 2. Club-Specific Judge Tests

These tests verify the personality and criteria of each specific AI judge.

### 🖤 Berghain Tests

#### Scenario D: The "Techno Purist" (Accept)
- **Input**: Solo person, all black clothing, combat boots, serious face, industrial background.
- **Club**: Berghain
- **Expected Result**: **ACCEPT**
- **Tone**: Grudging respect, minimalist.
- **Example Response**: "Fine. You look like you know the drill. Silence your phone and don't smile."

#### Scenario E: The "Rainbow Raver" (Reject)
- **Input**: Someone wearing a bright yellow hoodie or floral dress.
- **Club**: Berghain
- **Expected Result**: **REJECT**
- **Tone**: Disdainful, harsh.
- **Example Response**: "You look like a highlighter. We don't do color here. Go to Sisyphus."

### 💋 KitKat Tests

#### Scenario F: The "Fetish Icon" (Accept)
- **Input**: Leather harness, latex bodysuit, fishnets, bold makeup.
- **Club**: KitKat
- **Expected Result**: **ACCEPT**
- **Tone**: Flirty, approving, edgy.
- **Example Response**: "Mmm, now that's an outfit. Leather looks good on you. Come inside and play."

#### Scenario G: The "Office Worker" (Reject)
- **Input**: Jeans and a t-shirt, or a business suit.
- **Club**: KitKat
- **Expected Result**: **REJECT**
- **Tone**: Mocking, bored.
- **Example Response**: "Did you get lost on your way to a tax audit? This is KitKat. We need skin, leather, or latex. Boring."

### 🌈 Sisyphus Tests

#### Scenario H: The "Creative Soul" (Accept)
- **Input**: Colorful patterns, glitter, face paint, unique accessories, festival vibes.
- **Club**: Sisyphus
- **Expected Result**: **ACCEPT**
- **Tone**: Warm, enthusiastic, "vibey".
- **Example Response**: "Love the energy! That glitter is a vibe. You're going to fit right in on the dancefloor. Welcome!"

#### Scenario I: The "Normie" (Reject)
- **Input**: Plain grey sweater, khakis, no accessories.
- **Club**: Sisyphus
- **Expected Result**: **REJECT**
- **Tone**: Disappointed but constructive.
- **Example Response**: "A bit too serious for us! We want color, we want art! Go put on some glitter and come back."

---

## 3. Edge Case & Stress Tests

### Scenario J: The "Ambiguous Style"
- **Input**: All black but with a colorful accessory (e.g., red scarf).
- **Club**: Berghain
- **Test**: Does the AI catch the color? It should likely **REJECT**.

### Scenario K: The "Group of 2"
- **Input**: Two people in valid outfits.
- **Club**: Berghain
- **Test**: Should **ACCEPT** (since limit is > 2). Verifies the logic isn't rejecting *all* groups.

### Scenario L: Low Quality Photo
- **Input**: Blurry or dark photo.
- **Club**: Any
- **Test**: AI should ideally ask for a clearer photo or make a joke about the mystery.

---

## 📝 Testing Log Template

Keep track of your results to refine the prompts!

| Test # | Photo Desc. | Club | Expected | Actual Result | Notes/Fix Needed |
|--------|-------------|------|----------|---------------|------------------|
| 1      | Black hoodie| Berg | Accept   | Accept        | Perfect          |
| 2      | Blue jeans  | Berg | Reject   | Reject        | Roast was funny  |
| 3      | 3 people    | Berg | Reject   | Reject        | Logic worked     |
| ...    |             |      |          |               |                  |

Happy Testing! 🕵️‍♂️🤖

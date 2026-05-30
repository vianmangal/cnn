Latest evaluation summary (2026-05-30)

- Overall accuracy: 61.45% (6236 samples)
- Macro avg (precision/recall/f1): 59.29 / 58.95 / 59.03
- Weighted avg (precision/recall/f1): 62.28 / 61.45 / 61.76


Top confusions (true -> predicted):
- fear -> sad: 267
- sad -> neutral: 253
- neutral -> sad: 205
- sad -> fear: 177
- angry -> sad: 156

Notes:
- Confusions remain strongest between fear/sad and sad/neutral, which suggests overlap in subtle expressions.
- Sensitivity to lighting and pose can still reduce recall for fear and sad.

Use cases:
1) Human-computer interaction: adaptive UI/UX, smart assistants, accessibility systems
2) Driver fatigue detection: detect tired expressions and alert drivers
3) Security and surveillance: coarse emotion cues to support monitoring
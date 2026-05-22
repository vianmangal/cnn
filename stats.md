“On the latest run, overall accuracy is 56.76%.

Top confusions: fear -> sad (256), neutral -> sad (248), angry -> sad (169), sad -> neutral (150), fear -> angry (143).

This indicates a bias toward predicting sad when expressions are subtle or ambiguous.

Limitations include sensitivity to lighting and pose, especially for fear vs sad.

Use case:

1)Human–Computer Interaction (HCI):
adaptive UI/UX
smart assistants
emotionally aware AI
accessibility systems

2)Driver Fatigue Detection
Example
Eyes drooping + tired expression
↓
Alert driver
Used in:
smart vehicles
trucking systems

3)Security & Surveillance

---

2026-05-22 — Evaluation (best checkpoint: models/emotion_cnn_20260521_212859_best.keras)

- **Overall accuracy**: 62.62% (6236 samples)
- **Macro avg (precision/recall/f1)**: 61.48 / 60.35 / 59.71
- **Weighted avg (precision/recall/f1)**: 64.57 / 62.62 / 62.60

- **Per-class (precision / recall / f1 / support)**:
	- angry: 0.4718 / 0.6973 / 0.5628 (958)
	- fear: 0.6218 / 0.3613 / 0.4571 (1024)
	- happy: 0.9033 / 0.8219 / 0.8607 (1774)
	- neutral: 0.5546 / 0.6261 / 0.5882 (1233)
	- sad: 0.5226 / 0.5108 / 0.5166 (1247)

- **Top confusions (true -> predicted)**:
	- fear -> angry: 258
	- sad -> neutral: 244
	- sad -> angry: 243
	- fear -> sad: 228
	- neutral -> sad: 218

Notes: this run (best checkpoint) improved overall accuracy compared to the earlier recorded 56.76%, but confusion remains between fear/sad and sad/neutral. Consider augmentation, class rebalancing, or focal loss to reduce these specific confusions.
module.exports = {
  review: {
    healthCareTeam: [
      'Primary Care:', 'Psychiatrist:', 'Neurologist:', 'Dentist:', 'Optometrist:'
    ],
    support:[
      'Client Responsible Adult (CRA):', 'Guardian:'
    ],
    healthHistory: [
      'Axis I:', 'Axis II:', 'Axis III:', 'Axis IV:', 'History of Major Medical/Surgical Occurrences:'
    ]
  },
  systems: {
    neurological: [
      'Headaches', 'Pupils equal and reactive to light and accommodation', 'Heat/cold reflex', 'Dizziness',
      'Tremors', 'Extrapyramidal symptoms', 'Impaired balance/coordination', 'Numbness/tingling/Paresthesia',
      'Medication side effects', 'Paralysis', 'Petit Mal', 'Clonic (repretitive jerking)', 'Absence', 'Tonic (muscle rigidity)',
      'Myoclonic (sporadic Jerking)', 'Atonic (loss of muscle tone)'
    ],
    een:[
      {
        title: 'Eye/Vision',
        checks: ['Clear', 'Red', 'Right impaired', 'Left impaired', 'Adaptive aid']
      },
      {
        title: 'Ears/Hearing',
        checks: ['Normal', 'Ringing', 'Right impaired', 'Left impaired', 'Adaptive aid']
      },
      {
        title: 'Nose/Smell',
        checks: ['Within normal limits', 'Smell intact', 'Smell not intact', 'Nose bleed', 'Frequent sinus congestion', 'Frequent sinus infection']
      },
      {
        title: 'Oral',
        checks: ['Within normal limits', 'Difficulty chewing', 'Mouth pain', 'Halitosis', 'Dentures', 'Endentulous', 'Involuntary tongue movement', 'Dry mouth from medications']
      },
      {
        title: 'Throat',
        checks: ['Within normal limits', 'Sore throats', 'Difficulty speaking', 'Difficulty swallowing', 'Tonsil enlargement', 'Thyroid enlargement', 'History of choking']
      }
    ],
    cardiovascular: [
      'Chest pain', 'Cool/Numb extremities', 'Capillary refil less than or equal to two seconds', 'Edema', 'Activities of daily living (ADL) limitations', 'Compression stockings'
    ],
    respiratory: {
      breathing: ['Slow', 'Normal', 'Rapid', 'Shallow', 'Painful'],
      illness: [
        'Short of breath', 'Feeding tube', 'Tracheostomy', 'Wheezing', 'Positioning orders', 'Continuous positive airway presure (CPAP)', 'Cough', 'Aspiration history', 'Inhalation agent',
        'Productive', 'Pneumonia history'
      ]
    },
    gastro: {
      type: ['Gastrostomy', 'Jejunostomy', 'No tube'],
      bowel: ['Bowel sounds', 'Last bowel movement', 'Bowel habits (frequency and description)'],
      others: ['Continent', 'Reflux', 'History of risk constipation', 'Frequent nausea', 'Straining pain', 'History of risk impaction', 'Frequent vomiting', 'Diarrhea', 'Bowel program',
        'Indigestion', 'Odd stools', 'Medications influencing bowels (laxatives, anti-diarrheals, Iron, Calcium, Anticholinergics, etc.)', 'Heartburn', 'Hemorrhoids', 'Apetite loss',
        'Independent toileting'
      ]
    },
    musculoskeletal: [
      'Pain', 'Prosthesis', 'Impaired range of motion', 'Weakness', 'Deformity', 'Impaired gait', 'Stiffness', 'Contractures', 'Adaptive equipment'
    ],
    genitourinary: [
      'Incontinent', 'Flank pain', 'Sexually active', 'Stress', 'Urge', 'History of urinary tract infections', 'Prostate issues', 'Bladder program', 'Discharge', 'Frequent urination',
      'Itching', 'Cloudy/dark urine', 'Hemodialysis', 'Bloody urine', 'Peritoneal dialysis'
    ],
    integumentary: {
      skin: ['Normal', 'Moist', 'Dry', 'Cyanotic', 'Warm', 'Pale', 'Jaundice', 'Cold', 'Dusky', 'Flushed'],
      illness: ['Open wound', 'Rash', 'Blemished', 'Bruising', 'Diaphoretic', 'Poor skin turgor', 'Breakdown related to adaptive aids/prosthesis', 'Risk for breakdown', 'History of breakdown']
    },
    endocrine:  {
      types: ['Thyroid dysfunction', 'Atypical antiphychotics or other medications affecting blood sugar', 'Pre-Diabetic hypoglycemic/hyperglycemic episodes'],
      diabetes: [
        'Diet', 'Oral Medications', 'Insulin', 'Other injectable medication to manage diabetes'
      ]
    }
  }
}
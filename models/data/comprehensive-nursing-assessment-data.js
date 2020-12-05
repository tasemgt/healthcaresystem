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
  },
  healthStatus:{
    immunizations: [
      'DPT', 'TOPV', 'HIB', 'MMR', 'TD', 'TDS', 'FLU SHOT'
    ],
    nutritional: {
      assessments: [ 'Orally', 'Via jejunostomy tube', 'Via gastrotomy tube', 'Other' ],
      items: [
        'Recent weight change', 'Recent changes in appetite/medication', 'Satisfied with current weight', 'Food use as a coping mechanism',
        'Assistive devices with eating', 'Use of medications that can cause difficulty swallowing (e.g., Abilify, other psychoactives),', 'Knowledge of 4 basic food groups',
        'Access to healthy/appropriate diet', 'Dietary deficiencies', 'Adequate fluid intake', 'Nutritional supplements', 'Interactions with medications and food'
      ]
    },
    mentalStatus: {
      appearance: [
        {
          title: 'Posture:',
          items: ['Normal', 'Rigid', 'Slouched']
        },
        {
          title: 'Grooming and Dress:',
          items: ['Appropriate', 'Inappropriate', 'Disheveled', 'Neat']
        },
        {
          title: 'Facial Expression:',
          items: ['Calm', 'Alert', 'Stressed', 'Perplexed', 'Tense', 'Dazed']
        },
        {
          title: 'Eye Contact:',
          items: ['Eyes not open', 'Good contact', 'Avoids contact', 'Stares']
        },
        {
          title: 'Speech Quality:',
          items: ['Clear', 'Slow', 'Slurred', 'Loud', 'Rapid', 'Incoherent', 'Mute']
        }
      ],
      mood: [
        'Cooperative', 'Excited', 'Irritable', 'Uncooperative', 'Agitated', 'Scared', 'Depressed', 'Anxious', 'Hostile',
        'Euphoric', 'Suspicious', 'Angry'
      ]
    },
    cognition: [
      {
        title: 'Cognitive impairment',
        items: ['Mild', 'Moderate', 'Severe', 'Profound']
      },
      {
        title: 'Oriented',
        items: ['Person', 'Place', 'Time']
      },
      {
        title: 'Attention span',
        items: ['Easily distracted']
      },
      {
        title: 'Memory',
        items: ['Remote', 'Recent', 'Immediate recall']
      },
      {
        title: 'Emotions',
        items: ['Euphoric', 'Happy', 'Apathetic', 'Sadness', 'Depressed', 'Anxious', 'Irritable', 'Hostage feelings', 'Emotional lability',
          'Inappropriate affect'
        ]
      }
    ],
    thoughts: [
      {
        title: 'Delusions',
        items: ['Grandeur', 'Persecutory', 'Somatic', 'Other']
      },
      {
        title: 'Hallucinations',
        items: ['Visual', 'Auditory', 'Tactile', 'Olfactory']
      },
      {
        title: 'Thought process',
        items: ['Coherent Organized', 'Logical']
      },
      {
        title: 'Thought content',
        items: ['Phobias', 'Hypochondria', 'Antisocial urges', 'Obsessions', 'Suicidal ideations', 'Homicidal ideations']
      }
    ],
    behaviors: {
      headers: [
        'Are medications used to control any behaviors?',
        'Currently has a formal Behavior Plan?'
      ],
      items: [
        'Hurtful to self', 'Hurtful to others', 'Destructive to property', 'Pica', 'Resists care', 'Socially offensive/Disruptive Behavior',
        'At risk behavior of Wandering', 'At risk behavior of Elopement', 'At risk behavior of Sexually aggressive behavior', 'History of suicide attempt',
        'Other serious behavior'
      ]
    },
    communication: [
      'Verbal', 'Limited verbal', 'Gestures', 'Sign language', 'Facial expressions', 'Eye movement', 'Paralinguistics (sounds)', 
      'Touch', 'Body language', 'Acting out', 'Head banging', 'Augmented communication device'
    ]
  }
}
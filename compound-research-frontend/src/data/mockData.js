export const dashboardStats = {
  compounds: 25,
  targets: 12,
  documents: 8,
  queries: 42,
};


export const recentCompounds = [
  {
    id: 1,
    name: "Imatinib",
    identifier: "DB00619",
    target: "BCR-ABL1",
    category: "Cancer",
  },
  {
    id: 2,
    name: "Gefitinib",
    identifier: "DB00317",
    target: "EGFR",
    category: "Cancer",
  },
  {
    id: 3,
    name: "Erlotinib",
    identifier: "DB00530",
    target: "EGFR",
    category: "Cancer",
  },
  {
    id: 4,
    name: "Osimertinib",
    identifier: "DB09330",
    target: "EGFR",
    category: "Cancer",
  },
];


export const compounds = [
  {
    id: 1,
    name: "Imatinib",
    identifier: "DB00619",
    description:
      "A tyrosine kinase inhibitor used in the treatment of several cancers.",
    targets: ["BCR-ABL1", "KIT", "PDGFR"],
    categories: ["Cancer", "Kinase Inhibitor"],
  },

  {
    id: 2,
    name: "Gefitinib",
    identifier: "DB00317",
    description:
      "A selective inhibitor of the epidermal growth factor receptor.",
    targets: ["EGFR"],
    categories: ["Cancer", "EGFR Inhibitor"],
  },

  {
    id: 3,
    name: "Erlotinib",
    identifier: "DB00530",
    description:
      "A small molecule inhibitor targeting the epidermal growth factor receptor.",
    targets: ["EGFR"],
    categories: ["Cancer", "EGFR Inhibitor"],
  },

  {
    id: 4,
    name: "Osimertinib",
    identifier: "DB09330",
    description:
      "A third-generation EGFR tyrosine kinase inhibitor.",
    targets: ["EGFR"],
    categories: ["Cancer", "EGFR Inhibitor"],
  },

  {
    id: 5,
    name: "Trastuzumab",
    identifier: "DB00072",
    description:
      "A monoclonal antibody targeting the HER2 receptor.",
    targets: ["HER2"],
    categories: ["Cancer", "Monoclonal Antibody"],
  },

  {
    id: 6,
    name: "Vemurafenib",
    identifier: "DB08881",
    description:
      "A BRAF kinase inhibitor used in selected cancers.",
    targets: ["BRAF"],
    categories: ["Cancer", "Kinase Inhibitor"],
  },
];


export const documents = [
  {
    id: 1,
    name: "EGFR Signaling and Targeted Cancer Therapy",
    fileName: "egfr-signaling.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedDate: "2026-08-08",
    description:
      "Reference material covering EGFR signaling pathways and targeted therapies.",
    relatedCompounds: [
      "Gefitinib",
      "Erlotinib",
      "Osimertinib",
    ],
  },

  {
    id: 2,
    name: "BCR-ABL1 and Tyrosine Kinase Inhibitors",
    fileName: "bcr-abl1-review.pdf",
    type: "PDF",
    size: "3.1 MB",
    uploadedDate: "2026-08-07",
    description:
      "Review of BCR-ABL1 biology and tyrosine kinase inhibitors.",
    relatedCompounds: [
      "Imatinib",
    ],
  },

  {
    id: 3,
    name: "HER2 Targeted Therapies",
    fileName: "her2-therapies.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedDate: "2026-08-05",
    description:
      "Research reference covering HER2-targeted therapeutic approaches.",
    relatedCompounds: [
      "Trastuzumab",
    ],
  },

  {
    id: 4,
    name: "BRAF Inhibition in Cancer",
    fileName: "braf-inhibition.pdf",
    type: "PDF",
    size: "2.7 MB",
    uploadedDate: "2026-08-03",
    description:
      "Reference material about BRAF signaling and BRAF inhibitors.",
    relatedCompounds: [
      "Vemurafenib",
    ],
  },
];
// ============================================
// Theological Topics Taxonomy
// ============================================
// A curated set of theological topics with descriptions,
// related scripture references, and suggested discussion questions.

import { ScriptureReference } from "@/types";

export interface TheologicalTopic {
  id: string;
  label: string;
  description: string;
  category: TopicCategory;
  relatedTopics: string[]; // ids of related topics
  keyPassages: ScriptureReference[];
  suggestedQuestions: string[];
  contextNotes: {
    historical?: string;
    theological?: string;
  };
}

export type TopicCategory =
  | "doctrine"
  | "salvation"
  | "christian-life"
  | "god"
  | "christ"
  | "holy-spirit"
  | "scripture"
  | "church"
  | "eschatology"
  | "ethics";

export const TOPIC_CATEGORIES: { value: TopicCategory; label: string }[] = [
  { value: "god", label: "God & His Attributes" },
  { value: "christ", label: "Jesus Christ" },
  { value: "holy-spirit", label: "Holy Spirit" },
  { value: "salvation", label: "Salvation" },
  { value: "doctrine", label: "Doctrine & Theology" },
  { value: "christian-life", label: "Christian Living" },
  { value: "scripture", label: "Scripture & Revelation" },
  { value: "church", label: "Church & Community" },
  { value: "eschatology", label: "End Times" },
  { value: "ethics", label: "Ethics & Morality" },
];

// ── The Master Topic List ──

export const THEOLOGICAL_TOPICS: TheologicalTopic[] = [
  // ═══ GOD & HIS ATTRIBUTES ═══
  {
    id: "sovereignty-of-god",
    label: "Sovereignty of God",
    description:
      "God's supreme authority and control over all creation, history, and human affairs.",
    category: "god",
    relatedTopics: ["providence", "predestination", "omnipotence"],
    keyPassages: [
      { book: "Isaiah", chapter: 46, verseStart: 9, verseEnd: 10 },
      { book: "Romans", chapter: 9, verseStart: 19, verseEnd: 21 },
      { book: "Ephesians", chapter: 1, verseStart: 11 },
      { book: "Daniel", chapter: 4, verseStart: 35 },
      { book: "Psalms", chapter: 115, verseStart: 3 },
      { book: "Proverbs", chapter: 19, verseStart: 21 },
    ],
    suggestedQuestions: [
      "How does God's sovereignty interact with human free will and responsibility?",
      "What comfort does God's sovereignty provide in times of suffering?",
      "How does understanding God's sovereignty affect the way we pray?",
    ],
    contextNotes: {
      theological:
        "The sovereignty of God is foundational to Reformed theology and is affirmed across all major Christian traditions, though its relationship to human freedom is debated.",
    },
  },
  {
    id: "holiness-of-god",
    label: "Holiness of God",
    description:
      "God's absolute moral purity, separateness from sin, and transcendent perfection.",
    category: "god",
    relatedTopics: ["fear-of-the-lord", "sanctification", "sin"],
    keyPassages: [
      { book: "Isaiah", chapter: 6, verseStart: 1, verseEnd: 7 },
      { book: "Revelation", chapter: 4, verseStart: 8 },
      { book: "1 Peter", chapter: 1, verseStart: 15, verseEnd: 16 },
      { book: "Leviticus", chapter: 19, verseStart: 2 },
      { book: "Habakkuk", chapter: 1, verseStart: 13 },
    ],
    suggestedQuestions: [
      "What did Isaiah experience when confronted with God's holiness?",
      "How should God's holiness shape our worship and daily life?",
      "What is the relationship between God's holiness and His love?",
    ],
    contextNotes: {
      historical:
        "Isaiah's temple vision (ch. 6) occurred in the year King Uzziah died (approximately 740 BC), a time of political uncertainty in Judah.",
      theological:
        "God's holiness is considered by many theologians (e.g. R.C. Sproul) to be His primary attribute — the only attribute repeated three times in succession in Scripture.",
    },
  },
  {
    id: "trinity",
    label: "The Trinity",
    description:
      "The Christian doctrine that God eternally exists as three distinct persons — Father, Son, and Holy Spirit — who are each fully God, yet there is one God.",
    category: "god",
    relatedTopics: ["deity-of-christ", "holy-spirit-person", "monotheism"],
    keyPassages: [
      { book: "Matthew", chapter: 28, verseStart: 19 },
      { book: "2 Corinthians", chapter: 13, verseStart: 14 },
      { book: "Genesis", chapter: 1, verseStart: 26 },
      { book: "John", chapter: 1, verseStart: 1, verseEnd: 3 },
      { book: "Matthew", chapter: 3, verseStart: 16, verseEnd: 17 },
      { book: "Isaiah", chapter: 48, verseStart: 16 },
    ],
    suggestedQuestions: [
      "How do we see all three persons of the Trinity at Jesus' baptism?",
      "Why is the Trinity essential to the Christian understanding of salvation?",
      "How does the Trinity model perfect community and relationship?",
    ],
    contextNotes: {
      historical:
        "The doctrine of the Trinity was formally articulated at the Council of Nicaea (325 AD) and the Council of Constantinople (381 AD), though the concept is rooted in the New Testament.",
      theological:
        "The Trinity is not tritheism (three gods) nor modalism (one God in three modes). Each person is distinct yet shares the same divine essence.",
    },
  },
  {
    id: "omnipotence",
    label: "Omnipotence of God",
    description: "God's unlimited power and ability to do all things consistent with His nature.",
    category: "god",
    relatedTopics: ["sovereignty-of-god", "creation", "miracles"],
    keyPassages: [
      { book: "Jeremiah", chapter: 32, verseStart: 17 },
      { book: "Matthew", chapter: 19, verseStart: 26 },
      { book: "Psalms", chapter: 147, verseStart: 5 },
      { book: "Job", chapter: 42, verseStart: 2 },
    ],
    suggestedQuestions: [
      "What does it mean that nothing is impossible with God?",
      "How does God's omnipotence relate to things He chooses not to do?",
      "How does God's power give us confidence in His promises?",
    ],
    contextNotes: {
      theological:
        "God's omnipotence means He can do all things consistent with His nature. He cannot lie, sin, or deny Himself — not from lack of power but because these contradict His character.",
    },
  },
  {
    id: "love-of-god",
    label: "Love of God",
    description: "God's eternal, unconditional, and self-giving love for His creation and His people.",
    category: "god",
    relatedTopics: ["grace", "mercy", "atonement"],
    keyPassages: [
      { book: "1 John", chapter: 4, verseStart: 7, verseEnd: 12 },
      { book: "John", chapter: 3, verseStart: 16 },
      { book: "Romans", chapter: 5, verseStart: 8 },
      { book: "Romans", chapter: 8, verseStart: 38, verseEnd: 39 },
      { book: "Jeremiah", chapter: 31, verseStart: 3 },
      { book: "Ephesians", chapter: 2, verseStart: 4, verseEnd: 5 },
    ],
    suggestedQuestions: [
      "How does God demonstrate His love differently than human love?",
      "What is the relationship between God's love and His justice?",
      "How should experiencing God's love transform how we love others?",
    ],
    contextNotes: {
      theological:
        "Scripture says 'God is love' (1 John 4:8) — love is not merely something God does but who He is. This love is agape: self-sacrificial and unconditional.",
    },
  },
  {
    id: "providence",
    label: "Providence",
    description: "God's ongoing care, sustaining, and governing of all creation toward His purposes.",
    category: "god",
    relatedTopics: ["sovereignty-of-god", "trust", "suffering"],
    keyPassages: [
      { book: "Romans", chapter: 8, verseStart: 28 },
      { book: "Genesis", chapter: 50, verseStart: 20 },
      { book: "Matthew", chapter: 6, verseStart: 26, verseEnd: 30 },
      { book: "Psalms", chapter: 37, verseStart: 23, verseEnd: 24 },
      { book: "Proverbs", chapter: 16, verseStart: 9 },
    ],
    suggestedQuestions: [
      "How did Joseph's life illustrate God's providence?",
      "How can we trust God's providence when circumstances seem harmful?",
      "What is the difference between fate and divine providence?",
    ],
    contextNotes: {
      historical:
        "Joseph's story spans roughly 13 years of slavery and imprisonment before God's purpose was revealed — a powerful illustration of long-term providential care.",
    },
  },

  // ═══ JESUS CHRIST ═══
  {
    id: "deity-of-christ",
    label: "Deity of Jesus Christ",
    description:
      "The biblical teaching that Jesus Christ is fully God — the second person of the Trinity who took on human nature.",
    category: "christ",
    relatedTopics: ["trinity", "incarnation", "pre-existence-of-christ"],
    keyPassages: [
      { book: "John", chapter: 1, verseStart: 1, verseEnd: 14 },
      { book: "Colossians", chapter: 1, verseStart: 15, verseEnd: 20 },
      { book: "Hebrews", chapter: 1, verseStart: 1, verseEnd: 4 },
      { book: "Philippians", chapter: 2, verseStart: 5, verseEnd: 11 },
      { book: "John", chapter: 10, verseStart: 30 },
      { book: "John", chapter: 8, verseStart: 58 },
      { book: "Titus", chapter: 2, verseStart: 13 },
    ],
    suggestedQuestions: [
      "What evidence does the Gospel of John present for Jesus' deity?",
      "Why is it essential for salvation that Jesus is fully God?",
      "How did Jesus' claims about Himself demonstrate His divine identity?",
    ],
    contextNotes: {
      historical:
        "The early church affirmed Jesus' deity against Arianism at Nicaea (325 AD). The Nicene Creed declares Christ 'God from God, Light from Light, true God from true God.'",
      theological:
        "John 1:1 uses 'Logos' (Word), a term meaningful in both Jewish (God's creative speech) and Greek (divine reason/order) contexts.",
    },
  },
  {
    id: "incarnation",
    label: "The Incarnation",
    description:
      "God the Son taking on human nature — becoming fully man while remaining fully God.",
    category: "christ",
    relatedTopics: ["deity-of-christ", "humanity-of-christ", "virgin-birth"],
    keyPassages: [
      { book: "John", chapter: 1, verseStart: 14 },
      { book: "Philippians", chapter: 2, verseStart: 5, verseEnd: 8 },
      { book: "Hebrews", chapter: 2, verseStart: 14, verseEnd: 18 },
      { book: "1 Timothy", chapter: 3, verseStart: 16 },
      { book: "Galatians", chapter: 4, verseStart: 4, verseEnd: 5 },
    ],
    suggestedQuestions: [
      "Why was it necessary for God to become human?",
      "What did Christ give up — and what did He not give up — in the incarnation?",
      "How does the incarnation demonstrate the value God places on humanity?",
    ],
    contextNotes: {
      theological:
        "The Council of Chalcedon (451 AD) defined the hypostatic union: Christ is one person with two natures (divine and human), without confusion, change, division, or separation.",
    },
  },
  {
    id: "atonement",
    label: "The Atonement",
    description:
      "Christ's sacrificial death on the cross as the means of reconciliation between God and humanity.",
    category: "christ",
    relatedTopics: ["justification", "redemption", "propitiation", "sin"],
    keyPassages: [
      { book: "Isaiah", chapter: 53, verseStart: 4, verseEnd: 6 },
      { book: "Romans", chapter: 3, verseStart: 23, verseEnd: 26 },
      { book: "2 Corinthians", chapter: 5, verseStart: 21 },
      { book: "1 Peter", chapter: 2, verseStart: 24 },
      { book: "Hebrews", chapter: 9, verseStart: 22, verseEnd: 28 },
      { book: "1 John", chapter: 2, verseStart: 2 },
    ],
    suggestedQuestions: [
      "How does Isaiah 53 prophetically describe what Christ accomplished on the cross?",
      "What does it mean that Christ was made sin 'for us' (2 Cor 5:21)?",
      "How does the Old Testament sacrificial system foreshadow Christ's atonement?",
    ],
    contextNotes: {
      historical:
        "Isaiah 53 was written approximately 700 years before Christ. The Dead Sea Scrolls confirm this text predates Jesus, underscoring its prophetic nature.",
      theological:
        "Major atonement theories include penal substitution, Christus Victor, moral influence, and ransom theory. Most evangelical traditions emphasize penal substitutionary atonement.",
    },
  },
  {
    id: "resurrection",
    label: "Resurrection of Christ",
    description:
      "Christ's bodily rising from the dead on the third day, confirming His identity and securing salvation.",
    category: "christ",
    relatedTopics: ["atonement", "victory-over-death", "hope"],
    keyPassages: [
      { book: "1 Corinthians", chapter: 15, verseStart: 1, verseEnd: 8 },
      { book: "Romans", chapter: 6, verseStart: 4, verseEnd: 9 },
      { book: "Matthew", chapter: 28, verseStart: 1, verseEnd: 10 },
      { book: "John", chapter: 20, verseStart: 24, verseEnd: 29 },
      { book: "Acts", chapter: 2, verseStart: 24, verseEnd: 32 },
    ],
    suggestedQuestions: [
      "Why does Paul say our faith is 'in vain' without the resurrection?",
      "What is the significance of the bodily nature of the resurrection?",
      "How does Christ's resurrection give believers hope for their own future?",
    ],
    contextNotes: {
      historical:
        "The earliest Christian creed (1 Cor 15:3-5) dates to within years of the crucifixion, demonstrating the resurrection was central to Christianity from its very beginning.",
    },
  },

  // ═══ SALVATION ═══
  {
    id: "justification",
    label: "Justification",
    description:
      "God's act of declaring a sinner righteous based on the finished work of Christ, received through faith alone.",
    category: "salvation",
    relatedTopics: ["faith", "grace", "imputation", "atonement"],
    keyPassages: [
      { book: "Romans", chapter: 3, verseStart: 21, verseEnd: 28 },
      { book: "Romans", chapter: 5, verseStart: 1, verseEnd: 2 },
      { book: "Galatians", chapter: 2, verseStart: 16 },
      { book: "Ephesians", chapter: 2, verseStart: 8, verseEnd: 9 },
      { book: "Philippians", chapter: 3, verseStart: 9 },
      { book: "Romans", chapter: 4, verseStart: 4, verseEnd: 5 },
    ],
    suggestedQuestions: [
      "What does it mean to be 'declared righteous' versus 'made righteous'?",
      "How does Paul's teaching on justification differ from earning God's favor?",
      "What role does faith play in justification — is it a work or a gift?",
    ],
    contextNotes: {
      historical:
        "Justification by faith alone (sola fide) was the central doctrine of the Protestant Reformation. Martin Luther called it 'the article by which the church stands or falls.'",
      theological:
        "Justification is a legal (forensic) declaration, distinct from sanctification which is the ongoing process of being made holy. Both are aspects of salvation but operate differently.",
    },
  },
  {
    id: "sanctification",
    label: "Sanctification",
    description:
      "The progressive work of the Holy Spirit making believers more like Christ in character and holiness.",
    category: "salvation",
    relatedTopics: ["holiness-of-god", "holy-spirit-work", "spiritual-growth"],
    keyPassages: [
      { book: "1 Thessalonians", chapter: 4, verseStart: 3, verseEnd: 7 },
      { book: "Philippians", chapter: 2, verseStart: 12, verseEnd: 13 },
      { book: "Romans", chapter: 6, verseStart: 1, verseEnd: 14 },
      { book: "2 Corinthians", chapter: 3, verseStart: 18 },
      { book: "Hebrews", chapter: 12, verseStart: 14 },
      { book: "Galatians", chapter: 5, verseStart: 22, verseEnd: 25 },
    ],
    suggestedQuestions: [
      "How is sanctification both God's work and our responsibility (Phil 2:12-13)?",
      "What role does the Holy Spirit play in the process of sanctification?",
      "How does understanding our identity in Christ fuel sanctification?",
    ],
    contextNotes: {
      theological:
        "Theologians distinguish between positional sanctification (our holy standing in Christ), progressive sanctification (our daily growth), and glorification (our future perfection).",
    },
  },
  {
    id: "grace",
    label: "Grace",
    description:
      "God's unmerited favor — His free gift of salvation and daily sustaining kindness given apart from anything we deserve.",
    category: "salvation",
    relatedTopics: ["justification", "mercy", "love-of-god"],
    keyPassages: [
      { book: "Ephesians", chapter: 2, verseStart: 8, verseEnd: 9 },
      { book: "Titus", chapter: 2, verseStart: 11, verseEnd: 14 },
      { book: "Romans", chapter: 5, verseStart: 20, verseEnd: 21 },
      { book: "2 Corinthians", chapter: 12, verseStart: 9 },
      { book: "John", chapter: 1, verseStart: 16, verseEnd: 17 },
    ],
    suggestedQuestions: [
      "What is the difference between grace and mercy?",
      "How does grace both save us and teach us to live godly lives (Titus 2:11-14)?",
      "Can grace be abused? How does Paul address this in Romans 6?",
    ],
    contextNotes: {
      theological:
        "Grace (Greek: charis) means 'unmerited favor.' The five solas of the Reformation include sola gratia — salvation by grace alone.",
    },
  },
  {
    id: "redemption",
    label: "Redemption",
    description:
      "God's act of buying back His people from the bondage of sin through the price of Christ's blood.",
    category: "salvation",
    relatedTopics: ["atonement", "freedom-in-christ", "slavery-to-sin"],
    keyPassages: [
      { book: "Ephesians", chapter: 1, verseStart: 7 },
      { book: "Colossians", chapter: 1, verseStart: 13, verseEnd: 14 },
      { book: "1 Peter", chapter: 1, verseStart: 18, verseEnd: 19 },
      { book: "Galatians", chapter: 3, verseStart: 13 },
      { book: "Titus", chapter: 2, verseStart: 14 },
      { book: "Exodus", chapter: 6, verseStart: 6, verseEnd: 7 },
    ],
    suggestedQuestions: [
      "How does the Exodus story foreshadow our redemption in Christ?",
      "What does it mean that we were 'bought with a price'?",
      "How should living as redeemed people change our daily priorities?",
    ],
    contextNotes: {
      historical:
        "Redemption (Greek: apolutrosis) comes from the slave market — paying a ransom price to free someone. This metaphor was vivid in the Roman world where slavery was widespread.",
    },
  },
  {
    id: "repentance",
    label: "Repentance",
    description:
      "A genuine turning away from sin and toward God, involving a change of mind, heart, and direction.",
    category: "salvation",
    relatedTopics: ["faith", "confession", "forgiveness"],
    keyPassages: [
      { book: "Acts", chapter: 3, verseStart: 19 },
      { book: "2 Corinthians", chapter: 7, verseStart: 9, verseEnd: 10 },
      { book: "Mark", chapter: 1, verseStart: 15 },
      { book: "Luke", chapter: 15, verseStart: 11, verseEnd: 24 },
      { book: "Acts", chapter: 17, verseStart: 30 },
    ],
    suggestedQuestions: [
      "What is the difference between godly sorrow and worldly sorrow (2 Cor 7:10)?",
      "How does the parable of the prodigal son illustrate true repentance?",
      "Is repentance a one-time event or an ongoing practice?",
    ],
    contextNotes: {
      theological:
        "The Greek word metanoia (repentance) literally means 'a change of mind.' True repentance involves the intellect (new understanding), emotions (godly sorrow), and will (changed behavior).",
    },
  },
  {
    id: "faith",
    label: "Faith",
    description:
      "Trust and confidence in God and His promises — the means by which we receive salvation and walk with God daily.",
    category: "salvation",
    relatedTopics: ["justification", "grace", "trust"],
    keyPassages: [
      { book: "Hebrews", chapter: 11, verseStart: 1, verseEnd: 6 },
      { book: "Romans", chapter: 10, verseStart: 17 },
      { book: "Ephesians", chapter: 2, verseStart: 8, verseEnd: 9 },
      { book: "James", chapter: 2, verseStart: 14, verseEnd: 26 },
      { book: "Habakkuk", chapter: 2, verseStart: 4 },
      { book: "Mark", chapter: 9, verseStart: 24 },
    ],
    suggestedQuestions: [
      "How does Hebrews 11 define faith, and what examples illustrate it?",
      "How do Paul (Eph 2:8-9) and James (James 2:14-26) complement each other on faith and works?",
      "What does it mean to live by faith in everyday life?",
    ],
    contextNotes: {
      theological:
        "Faith (Greek: pistis) encompasses knowledge (knowing the truth), assent (agreeing it is true), and trust (personally relying on it). Saving faith goes beyond mere intellectual agreement.",
    },
  },
  {
    id: "election",
    label: "Election & Predestination",
    description:
      "God's sovereign choice of individuals for salvation before the foundation of the world.",
    category: "salvation",
    relatedTopics: ["sovereignty-of-god", "grace", "calling"],
    keyPassages: [
      { book: "Ephesians", chapter: 1, verseStart: 4, verseEnd: 6 },
      { book: "Romans", chapter: 8, verseStart: 29, verseEnd: 30 },
      { book: "Romans", chapter: 9, verseStart: 10, verseEnd: 18 },
      { book: "John", chapter: 6, verseStart: 44 },
      { book: "2 Thessalonians", chapter: 2, verseStart: 13 },
    ],
    suggestedQuestions: [
      "What does Paul mean when he says God 'chose us before the foundation of the world'?",
      "How do different traditions (Reformed, Arminian) understand election?",
      "How should the doctrine of election produce humility rather than pride?",
    ],
    contextNotes: {
      theological:
        "Election is one of the most debated doctrines in Christianity. Calvinists emphasize unconditional election; Arminians emphasize election based on God's foreknowledge of faith.",
    },
  },

  // ═══ HOLY SPIRIT ═══
  {
    id: "holy-spirit-person",
    label: "Person of the Holy Spirit",
    description:
      "The Holy Spirit as the third person of the Trinity — not a force but a personal being who thinks, feels, and acts.",
    category: "holy-spirit",
    relatedTopics: ["trinity", "holy-spirit-work", "spiritual-gifts"],
    keyPassages: [
      { book: "John", chapter: 14, verseStart: 16, verseEnd: 17 },
      { book: "John", chapter: 16, verseStart: 7, verseEnd: 15 },
      { book: "Acts", chapter: 5, verseStart: 3, verseEnd: 4 },
      { book: "Ephesians", chapter: 4, verseStart: 30 },
      { book: "Romans", chapter: 8, verseStart: 26, verseEnd: 27 },
    ],
    suggestedQuestions: [
      "What evidence does Scripture give that the Holy Spirit is a person, not a force?",
      "What names and titles does Jesus use for the Holy Spirit in John 14-16?",
      "How do we grieve the Holy Spirit, and what does that imply about His nature?",
    ],
    contextNotes: {
      theological:
        "Jesus calls the Spirit 'Parakletos' (Helper/Advocate/Comforter) — a personal role. The Spirit teaches, guides, convicts, intercedes, and can be grieved — all attributes of personhood.",
    },
  },
  {
    id: "spiritual-gifts",
    label: "Spiritual Gifts",
    description:
      "Abilities given by the Holy Spirit to believers for the building up of the church and the common good.",
    category: "holy-spirit",
    relatedTopics: ["holy-spirit-person", "church-body", "service"],
    keyPassages: [
      { book: "1 Corinthians", chapter: 12, verseStart: 4, verseEnd: 11 },
      { book: "Romans", chapter: 12, verseStart: 6, verseEnd: 8 },
      { book: "Ephesians", chapter: 4, verseStart: 11, verseEnd: 13 },
      { book: "1 Peter", chapter: 4, verseStart: 10, verseEnd: 11 },
      { book: "1 Corinthians", chapter: 14, verseStart: 1, verseEnd: 5 },
    ],
    suggestedQuestions: [
      "How does Paul say spiritual gifts should be used within the body of Christ?",
      "What is the purpose of spiritual gifts — personal edification or corporate building up?",
      "How can believers discover and develop their spiritual gifts?",
    ],
    contextNotes: {
      theological:
        "The New Testament lists gifts in 1 Corinthians 12, Romans 12, Ephesians 4, and 1 Peter 4. Traditions differ on whether all gifts continue today (continuationism) or some have ceased (cessationism).",
    },
  },
  {
    id: "fruit-of-the-spirit",
    label: "Fruit of the Spirit",
    description:
      "The character qualities produced in believers by the Holy Spirit: love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control.",
    category: "holy-spirit",
    relatedTopics: ["sanctification", "holy-spirit-work", "christian-character"],
    keyPassages: [
      { book: "Galatians", chapter: 5, verseStart: 22, verseEnd: 26 },
      { book: "John", chapter: 15, verseStart: 4, verseEnd: 8 },
      { book: "Colossians", chapter: 3, verseStart: 12, verseEnd: 15 },
    ],
    suggestedQuestions: [
      "Why does Paul call these qualities 'fruit' (singular) rather than 'fruits'?",
      "How does abiding in Christ (John 15) produce the fruit of the Spirit?",
      "Which of these qualities is most challenging for you, and why?",
    ],
    contextNotes: {
      theological:
        "Paul contrasts the fruit of the Spirit with the 'works of the flesh' (Gal 5:19-21). The fruit is singular — it is one unified character produced by one Spirit, not a checklist of separate virtues.",
    },
  },

  // ═══ CHRISTIAN LIVING ═══
  {
    id: "prayer",
    label: "Prayer",
    description:
      "Communication with God — praise, confession, thanksgiving, and supplication — as a vital practice of the Christian life.",
    category: "christian-life",
    relatedTopics: ["trust", "faith", "holy-spirit-work"],
    keyPassages: [
      { book: "Matthew", chapter: 6, verseStart: 5, verseEnd: 15 },
      { book: "Philippians", chapter: 4, verseStart: 6, verseEnd: 7 },
      { book: "1 Thessalonians", chapter: 5, verseStart: 17 },
      { book: "James", chapter: 5, verseStart: 16 },
      { book: "Romans", chapter: 8, verseStart: 26, verseEnd: 27 },
      { book: "Psalms", chapter: 62, verseStart: 8 },
    ],
    suggestedQuestions: [
      "What principles for prayer does Jesus teach in the Lord's Prayer?",
      "How does the Holy Spirit help us in our prayer life (Romans 8:26-27)?",
      "What are the different types of prayer found in Scripture?",
    ],
    contextNotes: {
      historical:
        "The Lord's Prayer was revolutionary — Jesus invited ordinary people to address God as 'Father' (Abba), an intimate term that was uncommon in Jewish prayer of that era.",
    },
  },
  {
    id: "suffering",
    label: "Suffering & Trials",
    description:
      "The biblical perspective on suffering — its purpose, God's presence in it, and the hope that sustains believers through it.",
    category: "christian-life",
    relatedTopics: ["providence", "hope", "perseverance"],
    keyPassages: [
      { book: "Romans", chapter: 5, verseStart: 3, verseEnd: 5 },
      { book: "James", chapter: 1, verseStart: 2, verseEnd: 4 },
      { book: "1 Peter", chapter: 4, verseStart: 12, verseEnd: 13 },
      { book: "2 Corinthians", chapter: 4, verseStart: 16, verseEnd: 18 },
      { book: "Job", chapter: 1, verseStart: 20, verseEnd: 22 },
      { book: "Psalms", chapter: 34, verseStart: 18 },
    ],
    suggestedQuestions: [
      "How does Paul say suffering produces hope (Romans 5:3-5)?",
      "What can we learn from Job's response to catastrophic loss?",
      "How does the promise of future glory help us endure present suffering?",
    ],
    contextNotes: {
      theological:
        "The problem of evil (theodicy) asks: 'How can a good and powerful God allow suffering?' Scripture doesn't give a single systematic answer but reveals that God is sovereign over suffering, present in it, and works through it for His purposes.",
    },
  },
  {
    id: "forgiveness",
    label: "Forgiveness",
    description:
      "Both God's forgiveness of our sins through Christ and the call for believers to forgive others.",
    category: "christian-life",
    relatedTopics: ["grace", "mercy", "reconciliation"],
    keyPassages: [
      { book: "Ephesians", chapter: 4, verseStart: 32 },
      { book: "Matthew", chapter: 18, verseStart: 21, verseEnd: 35 },
      { book: "Colossians", chapter: 3, verseStart: 13 },
      { book: "1 John", chapter: 1, verseStart: 9 },
      { book: "Psalms", chapter: 103, verseStart: 12 },
    ],
    suggestedQuestions: [
      "Why does Jesus say we must forgive 'seventy times seven' times?",
      "What is the connection between receiving God's forgiveness and extending it to others?",
      "How is biblical forgiveness different from just 'forgetting'?",
    ],
    contextNotes: {
      theological:
        "Jesus' parable of the unforgiving servant (Matt 18) shows the enormity of our debt before God — making any offense against us comparatively small. This perspective fuels our ability to forgive.",
    },
  },
  {
    id: "worship",
    label: "Worship",
    description:
      "Ascribing worth to God through praise, thanksgiving, obedience, and surrender — both corporate and personal.",
    category: "christian-life",
    relatedTopics: ["prayer", "holiness-of-god", "love-of-god"],
    keyPassages: [
      { book: "John", chapter: 4, verseStart: 23, verseEnd: 24 },
      { book: "Romans", chapter: 12, verseStart: 1, verseEnd: 2 },
      { book: "Psalms", chapter: 95, verseStart: 1, verseEnd: 7 },
      { book: "Revelation", chapter: 5, verseStart: 11, verseEnd: 14 },
      { book: "Hebrews", chapter: 13, verseStart: 15, verseEnd: 16 },
    ],
    suggestedQuestions: [
      "What does it mean to worship God 'in spirit and in truth' (John 4:24)?",
      "How is all of life an act of worship (Romans 12:1)?",
      "What can we learn about worship from the heavenly scenes in Revelation?",
    ],
    contextNotes: {
      historical:
        "Jesus' conversation with the Samaritan woman about worship (John 4) was set against centuries of Jewish-Samaritan debate about the proper location of worship — Jerusalem vs. Mount Gerizim.",
    },
  },

  // ═══ SCRIPTURE & REVELATION ═══
  {
    id: "authority-of-scripture",
    label: "Authority of Scripture",
    description:
      "The Bible as the inspired, authoritative, and sufficient Word of God for faith and practice.",
    category: "scripture",
    relatedTopics: ["inspiration", "inerrancy", "sufficiency"],
    keyPassages: [
      { book: "2 Timothy", chapter: 3, verseStart: 16, verseEnd: 17 },
      { book: "2 Peter", chapter: 1, verseStart: 20, verseEnd: 21 },
      { book: "Psalms", chapter: 119, verseStart: 105 },
      { book: "Hebrews", chapter: 4, verseStart: 12 },
      { book: "Isaiah", chapter: 40, verseStart: 8 },
      { book: "Matthew", chapter: 5, verseStart: 18 },
    ],
    suggestedQuestions: [
      "What does Paul mean when he says Scripture is 'God-breathed' (2 Tim 3:16)?",
      "How does the Bible's authority differ from other forms of authority?",
      "What is the relationship between the Holy Spirit and the reading of Scripture?",
    ],
    contextNotes: {
      theological:
        "The Reformation cry 'Sola Scriptura' (Scripture alone) affirmed the Bible as the final authority in matters of faith, over church tradition or papal decree.",
    },
  },

  // ═══ CHURCH & COMMUNITY ═══
  {
    id: "church-body",
    label: "The Body of Christ",
    description:
      "The church as one body with many members, each with unique gifts and roles, united under Christ as the head.",
    category: "church",
    relatedTopics: ["spiritual-gifts", "unity", "service"],
    keyPassages: [
      { book: "1 Corinthians", chapter: 12, verseStart: 12, verseEnd: 27 },
      { book: "Ephesians", chapter: 4, verseStart: 1, verseEnd: 6 },
      { book: "Romans", chapter: 12, verseStart: 4, verseEnd: 5 },
      { book: "Colossians", chapter: 1, verseStart: 18 },
    ],
    suggestedQuestions: [
      "What does the 'body' metaphor teach about unity and diversity in the church?",
      "Why does Paul say the 'weaker' parts of the body are indispensable?",
      "How does belonging to a local church body reflect God's design?",
    ],
    contextNotes: {
      theological:
        "Paul's body metaphor was counter-cultural in the Greco-Roman world where social hierarchies were rigid. In Christ's body, every member — regardless of status — is essential.",
    },
  },
  {
    id: "great-commission",
    label: "The Great Commission",
    description:
      "Christ's command to make disciples of all nations through evangelism, baptism, and teaching.",
    category: "church",
    relatedTopics: ["evangelism", "discipleship", "mission"],
    keyPassages: [
      { book: "Matthew", chapter: 28, verseStart: 18, verseEnd: 20 },
      { book: "Acts", chapter: 1, verseStart: 8 },
      { book: "Mark", chapter: 16, verseStart: 15 },
      { book: "Romans", chapter: 10, verseStart: 14, verseEnd: 15 },
    ],
    suggestedQuestions: [
      "What is the main verb in the Great Commission — 'go' or 'make disciples'?",
      "How does Jesus' promise 'I am with you always' empower the mission?",
      "What does it look like to fulfill the Great Commission in your context?",
    ],
    contextNotes: {
      theological:
        "The Great Commission's main command is 'make disciples' (mathēteusate). 'Go,' 'baptizing,' and 'teaching' are participles that describe how disciples are made.",
    },
  },

  // ═══ ESCHATOLOGY ═══
  {
    id: "second-coming",
    label: "Second Coming of Christ",
    description:
      "The promised return of Jesus Christ to judge the living and the dead and to establish His kingdom fully.",
    category: "eschatology",
    relatedTopics: ["resurrection", "judgment", "hope"],
    keyPassages: [
      { book: "Acts", chapter: 1, verseStart: 11 },
      { book: "1 Thessalonians", chapter: 4, verseStart: 16, verseEnd: 17 },
      { book: "Revelation", chapter: 22, verseStart: 20 },
      { book: "Matthew", chapter: 24, verseStart: 30, verseEnd: 31 },
      { book: "Titus", chapter: 2, verseStart: 13 },
    ],
    suggestedQuestions: [
      "How should the hope of Christ's return affect the way we live today?",
      "What does Jesus teach about the timing of His return?",
      "How does the second coming complete what the first coming began?",
    ],
    contextNotes: {
      theological:
        "Major views on the second coming include premillennialism, postmillennialism, and amillennialism — each interpreting the timing and nature of Christ's return differently.",
    },
  },
  {
    id: "new-creation",
    label: "New Creation",
    description:
      "God's promise to make all things new — restoring creation, removing the curse, and dwelling with His people forever.",
    category: "eschatology",
    relatedTopics: ["second-coming", "hope", "redemption"],
    keyPassages: [
      { book: "Revelation", chapter: 21, verseStart: 1, verseEnd: 5 },
      { book: "2 Peter", chapter: 3, verseStart: 13 },
      { book: "Isaiah", chapter: 65, verseStart: 17, verseEnd: 19 },
      { book: "Romans", chapter: 8, verseStart: 19, verseEnd: 22 },
      { book: "2 Corinthians", chapter: 5, verseStart: 17 },
    ],
    suggestedQuestions: [
      "What will be different about the new creation compared to the current world?",
      "How does the vision of Revelation 21 provide hope for those who are suffering?",
      "In what sense are believers already part of the 'new creation' (2 Cor 5:17)?",
    ],
    contextNotes: {
      theological:
        "The Bible's story arc moves from garden (Genesis 1-2) to city (Revelation 21-22) — not an abandonment of creation but its restoration and perfection. God's plan is redemption, not escape.",
    },
  },

  // ═══ DOCTRINE ═══
  {
    id: "sin",
    label: "Sin & the Fall",
    description:
      "Humanity's rebellion against God beginning with Adam and Eve, resulting in spiritual death, broken relationship with God, and a corrupted nature inherited by all people.",
    category: "doctrine",
    relatedTopics: ["atonement", "repentance", "redemption"],
    keyPassages: [
      { book: "Genesis", chapter: 3, verseStart: 1, verseEnd: 19 },
      { book: "Romans", chapter: 3, verseStart: 23 },
      { book: "Romans", chapter: 5, verseStart: 12, verseEnd: 14 },
      { book: "Romans", chapter: 6, verseStart: 23 },
      { book: "Isaiah", chapter: 59, verseStart: 2 },
      { book: "Psalms", chapter: 51, verseStart: 5 },
    ],
    suggestedQuestions: [
      "What was the nature of the first sin — was it more than eating fruit?",
      "How does Paul explain the spread of sin from Adam to all humanity?",
      "What are the effects of the Fall on human nature, relationships, and creation?",
    ],
    contextNotes: {
      historical:
        "Genesis 3 is set in the Garden of Eden, a paradise designed for unbroken fellowship between God and humanity. The serpent's temptation targeted trust in God's goodness and word.",
      theological:
        "The doctrine of original sin teaches that Adam's fall affected all humanity. Different traditions debate the extent — total depravity (Reformed) vs. weakened nature (Arminian/Catholic).",
    },
  },
  {
    id: "covenant",
    label: "Covenant",
    description:
      "God's binding agreements with His people — from Noah, Abraham, Moses, and David to the New Covenant in Christ.",
    category: "doctrine",
    relatedTopics: ["faithfulness", "promise", "atonement"],
    keyPassages: [
      { book: "Genesis", chapter: 12, verseStart: 1, verseEnd: 3 },
      { book: "Genesis", chapter: 15, verseStart: 1, verseEnd: 6 },
      { book: "Jeremiah", chapter: 31, verseStart: 31, verseEnd: 34 },
      { book: "Hebrews", chapter: 8, verseStart: 6, verseEnd: 13 },
      { book: "Luke", chapter: 22, verseStart: 20 },
      { book: "2 Samuel", chapter: 7, verseStart: 12, verseEnd: 16 },
    ],
    suggestedQuestions: [
      "How do the biblical covenants build upon each other to tell one story?",
      "What makes the New Covenant 'better' than the Old (Hebrews 8)?",
      "How did God's covenant with Abraham shape the rest of redemptive history?",
    ],
    contextNotes: {
      historical:
        "Ancient Near Eastern covenants followed cultural patterns — a superior king would bind himself in covenant with a lesser party. God's covenants adapt these forms but are initiated by grace, not mutual benefit.",
      theological:
        "Covenant theology sees the Bible as one unified story told through progressive covenants, each building toward fulfillment in Christ and the New Covenant.",
    },
  },
];

// ── Helper Functions ──

/** Get a topic by ID */
export function getTopic(id: string): TheologicalTopic | undefined {
  return THEOLOGICAL_TOPICS.find((t) => t.id === id);
}

/** Get all topics in a category */
export function getTopicsByCategory(category: TopicCategory): TheologicalTopic[] {
  return THEOLOGICAL_TOPICS.filter((t) => t.category === category);
}

/** Search topics by label or description */
export function searchTopics(query: string): TheologicalTopic[] {
  const q = query.toLowerCase();
  return THEOLOGICAL_TOPICS.filter(
    (t) =>
      t.label.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.id.includes(q)
  );
}

/** Get related topics for a given topic */
export function getRelatedTopics(topicId: string): TheologicalTopic[] {
  const topic = getTopic(topicId);
  if (!topic) return [];
  return topic.relatedTopics
    .map((id) => getTopic(id))
    .filter((t): t is TheologicalTopic => t !== undefined);
}

/** Get all topics that reference a specific book of the Bible */
export function getTopicsForBook(bookName: string): TheologicalTopic[] {
  return THEOLOGICAL_TOPICS.filter((t) =>
    t.keyPassages.some((p) => p.book.toLowerCase() === bookName.toLowerCase())
  );
}

/** Get all unique topic labels sorted alphabetically */
export function getAllTopicLabels(): string[] {
  return THEOLOGICAL_TOPICS.map((t) => t.label).sort();
}

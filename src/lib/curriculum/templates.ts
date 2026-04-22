// ============================================
// Curriculum Starter Templates
// ============================================

import { CurriculumCategory, StepBlock } from "@/types";

export interface CurriculumTemplate {
  id: string;
  name: string;
  description: string;
  category: CurriculumCategory;
  suggestedTopics: string[];
  steps: TemplateStep[];
}

interface TemplateStep {
  title: string;
  blocks: StepBlock[];
}

export const CURRICULUM_TEMPLATES: CurriculumTemplate[] = [
  // ── Book Study ──
  {
    id: "book-study",
    name: "Book Study",
    description:
      "A chapter-by-chapter study through a book of the Bible with context, teaching, and discussion.",
    category: "book-study",
    suggestedTopics: ["authority-of-scripture"],
    steps: [
      {
        title: "Introduction & Background",
        blocks: [
          {
            type: "context",
            historical_context: "Add the historical setting — when was this book written, and what was happening?",
            cultural_context: "What cultural norms and customs are relevant?",
            literary_context: "What genre is this book? What literary devices does the author use?",
            author_and_audience: "Who wrote this book, to whom, and why?",
          },
          {
            type: "teaching",
            content: "Write an overview of the book: its main themes, purpose, and place in the biblical narrative.",
          },
          {
            type: "video",
            url: "",
            title: "Book Overview Video",
            description: "Add a BibleProject or similar overview video here.",
          },
          {
            type: "discussion",
            questions: [
              "What do you already know about this book?",
              "What are you hoping to learn from this study?",
            ],
          },
        ],
      },
      {
        title: "Chapter 1 — [Title]",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Genesis", chapter: 1, verseStart: 1 },
          },
          {
            type: "teaching",
            content: "Write your commentary and insights on this chapter.",
          },
          {
            type: "cross-reference",
            references: [
              { book: "Genesis", chapter: 1, verseStart: 1 },
              { book: "John", chapter: 1, verseStart: 1 },
            ],
            note: "Connect key verses to other parts of Scripture.",
          },
          {
            type: "discussion",
            questions: [
              "What stands out to you most in this chapter?",
              "How does this passage apply to your life today?",
            ],
          },
        ],
      },
      {
        title: "Chapter 2 — [Title]",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Genesis", chapter: 2, verseStart: 1 },
          },
          {
            type: "teaching",
            content: "Write your commentary and insights on this chapter.",
          },
          {
            type: "discussion",
            questions: [
              "What themes from the previous chapter continue here?",
              "What new ideas are introduced?",
            ],
          },
        ],
      },
    ],
  },

  // ── Topical Study ──
  {
    id: "topical",
    name: "Topical Study",
    description:
      "Explore a theme or doctrine across multiple passages of Scripture, drawing connections throughout the Bible.",
    category: "topical",
    suggestedTopics: [],
    steps: [
      {
        title: "Defining the Topic",
        blocks: [
          {
            type: "teaching",
            content: "Define the topic clearly. What does this concept mean in Scripture? Why is it important for believers?",
          },
          {
            type: "scripture",
            reference: { book: "2 Timothy", chapter: 3, verseStart: 16, verseEnd: 17 },
            note: "Replace with a foundational passage for your topic.",
          },
          {
            type: "discussion",
            questions: [
              "What comes to mind when you think of this topic?",
              "Why is this an important subject for Christians to understand?",
            ],
          },
        ],
      },
      {
        title: "Old Testament Foundations",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Genesis", chapter: 1, verseStart: 1 },
            note: "Replace with OT passages that introduce or establish this theme.",
          },
          {
            type: "context",
            historical_context: "What is the Old Testament context for this topic?",
            theological_context: "How does this theme develop through the OT narrative?",
          },
          {
            type: "teaching",
            content: "Trace this theme through the Old Testament. Where does it first appear? How does it develop?",
          },
          {
            type: "discussion",
            questions: [
              "How did Old Testament believers understand this concept?",
              "What patterns or types foreshadow the New Testament fulfillment?",
            ],
          },
        ],
      },
      {
        title: "New Testament Fulfillment",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Romans", chapter: 1, verseStart: 1 },
            note: "Replace with NT passages that fulfill or expand this theme.",
          },
          {
            type: "cross-reference",
            references: [
              { book: "Genesis", chapter: 1, verseStart: 1 },
              { book: "Romans", chapter: 1, verseStart: 1 },
            ],
            note: "Show how the Old and New Testaments connect on this topic.",
          },
          {
            type: "teaching",
            content: "How does the New Testament bring this theme to its fullness? What role does Christ play?",
          },
          {
            type: "discussion",
            questions: [
              "How does Jesus fulfill or transform this Old Testament concept?",
              "What new understanding does the NT bring?",
            ],
          },
        ],
      },
      {
        title: "Application & Response",
        blocks: [
          {
            type: "teaching",
            content: "What does this topic mean for believers today? How should it shape the way we live, think, and worship?",
          },
          {
            type: "discussion",
            questions: [
              "How does understanding this topic change how you relate to God?",
              "What is one concrete way you can apply this truth this week?",
              "How would you explain this topic to someone new to the faith?",
            ],
          },
        ],
      },
    ],
  },

  // ── Character Study ──
  {
    id: "character-study",
    name: "Character Study",
    description:
      "Study the life of a biblical figure — their story, their faith, their failures, and what we learn from them.",
    category: "character-study",
    suggestedTopics: ["faith", "providence"],
    steps: [
      {
        title: "Introduction — Who Were They?",
        blocks: [
          {
            type: "context",
            historical_context: "When and where did this person live? What was the political and cultural setting?",
            author_and_audience: "Which biblical books tell their story? Who recorded it and why?",
          },
          {
            type: "teaching",
            content: "Introduce the character: their background, family, role in Israel or the early church, and why their story matters.",
          },
          {
            type: "discussion",
            questions: [
              "What do you already know about this person?",
              "What questions do you have about their life?",
            ],
          },
        ],
      },
      {
        title: "The Call — How God Chose Them",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Genesis", chapter: 12, verseStart: 1, verseEnd: 4 },
            note: "Replace with the passage where this person is called or introduced.",
          },
          {
            type: "teaching",
            content: "How did God call this person? What did He ask of them? How did they respond?",
          },
          {
            type: "discussion",
            questions: [
              "What can we learn from how this person responded to God's call?",
              "How does their call compare to how God works in our lives?",
            ],
          },
        ],
      },
      {
        title: "The Test — Trials & Failures",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Genesis", chapter: 16, verseStart: 1 },
            note: "Replace with a passage showing this person's struggles or failures.",
          },
          {
            type: "teaching",
            content: "Where did this person struggle, doubt, or fail? What were the consequences?",
          },
          {
            type: "discussion",
            questions: [
              "How do this person's failures make them more relatable?",
              "What does God's response to their failure teach us about His character?",
            ],
          },
        ],
      },
      {
        title: "The Legacy — What We Learn",
        blocks: [
          {
            type: "teaching",
            content: "What is this person's lasting legacy? How are they remembered in Scripture and in the life of the church?",
          },
          {
            type: "cross-reference",
            references: [
              { book: "Hebrews", chapter: 11, verseStart: 1 },
            ],
            note: "Are they mentioned in Hebrews 11 or elsewhere as an example of faith?",
          },
          {
            type: "discussion",
            questions: [
              "What one lesson from this person's life is most impactful to you?",
              "How does their story point to Christ?",
            ],
          },
        ],
      },
    ],
  },

  // ── Devotional ──
  {
    id: "devotional",
    name: "Devotional Series",
    description:
      "A shorter, reflective study focused on personal application and spiritual growth. Great for daily or weekly devotionals.",
    category: "devotional",
    suggestedTopics: ["prayer", "faith", "love-of-god"],
    steps: [
      {
        title: "Day 1 — [Theme]",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Psalms", chapter: 1, verseStart: 1, verseEnd: 6 },
            note: "Choose a short, focused passage for reflection.",
          },
          {
            type: "teaching",
            content: "Write a short devotional reflection — personal, warm, and focused on one key truth from this passage.",
          },
          {
            type: "discussion",
            questions: [
              "What does this passage reveal about God's character?",
              "How can you apply this truth today?",
            ],
            guidance: "Spend 5 minutes in quiet reflection before answering.",
          },
        ],
      },
      {
        title: "Day 2 — [Theme]",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Psalms", chapter: 23, verseStart: 1, verseEnd: 6 },
          },
          {
            type: "teaching",
            content: "Continue the devotional series — build on yesterday's theme or introduce a related idea.",
          },
          {
            type: "discussion",
            questions: [
              "What comfort does this passage bring to you personally?",
              "Write a short prayer in response to what you've read.",
            ],
          },
        ],
      },
      {
        title: "Day 3 — [Theme]",
        blocks: [
          {
            type: "scripture",
            reference: { book: "Psalms", chapter: 46, verseStart: 1, verseEnd: 11 },
          },
          {
            type: "teaching",
            content: "Bring the series to a meaningful conclusion — tie the themes together.",
          },
          {
            type: "discussion",
            questions: [
              "Looking back over these three days, what has stood out most?",
              "What is one thing you want to remember and carry forward?",
            ],
          },
        ],
      },
    ],
  },
];

/** Get a template by ID */
export function getTemplate(id: string): CurriculumTemplate | undefined {
  return CURRICULUM_TEMPLATES.find((t) => t.id === id);
}

# What Building My Portfolio Taught Me About Vibe Coding

After finishing this website, I have a more grounded view of Vibe Coding.

At first, I thought the hard part was getting AI to build the site. The harder part came earlier: deciding who the site was for, what people should remember, which work stories deserved attention, and which visual effects were getting in the way.

AI writes code quickly. It also amplifies unclear thinking quickly. A navigation bar, a breakpoint, or one sentence of copy can turn into repeated rework if the boundary is not clear.

This is my project reflection: what I built, which prompts and skills helped, where the process broke down, and what I would do differently as a PMO without a coding background.

---

## 1. Background

The project was my personal portfolio website.

I did not want to copy my resume into a web page. A resume is useful for screening. A portfolio can do something different: it can help people understand how I think and work.

So I shaped the site around case-based storytelling. The main stories covered brand migration, AI PMO workflow, growth programs, market localization, and global payments.

This was a good Vibe Coding project because it touched many layers at once: product structure, visual direction, front-end implementation, bilingual copy, responsive design, and a learning log. It also felt close to real PMO work. The goal changed, the requirements changed, the taste changed, and the project still needed a rhythm to reach a stable version.

---

## 2. What Worked

The most useful prompts did not ask AI to code immediately.

Asking for a PRD, information architecture, section structure, and interaction rhythm made a real difference. It turned “make a good-looking portfolio site” into a clearer delivery problem.

Some prompts worked especially well:

- rewrite experience as business cases, not as a list of jobs
- write Chinese and English separately, with different tone and rhythm
- explain what will be changed before editing the page
- keep internal instructions out of the public website
- clean code conservatively and remove only what is clearly unused

These prompts helped AI work within product judgment instead of simply generating more page variations.

---

## 3. How the Skills Helped

The skills and agents worked best when each one had a clear job.

| Skill / Agent | What it handled | What happened | My takeaway |
|---|---|---|---|
| UI / Design Review | Hero, color direction, liquid glass feel, navigation, and responsive layout | It helped me see when the site looked generic or too template-like | Design tools need a clear audience and tone before they can help well |
| Humanizer / Copy Review | Chinese copy, English copy, and public-facing wording | It removed many lines that sounded like internal prompts | Copy polish works better after the content model is clear |
| Browser / Playwright-style Testing | Preview, anchor jumps, mobile and desktop checks | It surfaced real issues such as overlap, weak contrast, and wide-screen layout problems | Testing needs acceptance criteria. “Please test it” is too vague |
| HyperFrames / Motion Exploration | Background video and AI atmosphere | It helped me decide that some motion was distracting | Motion should support reading, not compete with it |
| GitHub / Publishing Flow | Local commit, V1.0 tag, repository preparation | It turned the site from a local build into a versioned project | Publishing is part of delivery, not a final afterthought |

Some capabilities were underused. I should have locked the design system earlier. I also should have defined the case-study content model before writing too much copy. Without that structure, layout and writing changed together, which created extra rework.

That felt very familiar from project work. More tools do not create order by themselves. Rhythm still matters.

---

## 4. What Broke Down

The biggest issue was the lack of early top-level design.

I spent too much time reacting to whether the page looked good. I should have answered a few basic questions sooner:

- who will read this site
- what should they see first
- which experiences best represent me
- which details deserve a full case study
- which interactions help reading

Because these decisions were still moving, many later changes became repairs. Sticky navigation covered content. Light mode had weak contrast. Large screens made headings too large. Case cards had too much empty space. The learning log also took time to find the right place.

The code issues were real too: CSS, components, breakpoints, Markdown rendering, routes, and build behavior. I did not know many of these things well. But in the final product, they all appeared as experience issues.

The writing had a similar problem. Some early copy sounded like instructions to AI, such as “turn experience into business cases.” That language belongs in a prompt, not on a public site. The copy became better when it became quieter: fewer explanations, clearer judgment.

---

## 5. What I Learned as a Non-Coding PMO

The most time-consuming problems were not big features. They were small repeated issues.

Navigation covered headings.  
Light mode text became too pale.  
4K layouts made headings oversized.  
Mobile buttons became cramped.  
Markdown tables and diagrams needed extra care.

At first, I would say things like “this looks bad” or “this broke again.” That expressed the feeling, but it did not give AI enough structure.

Next time, I would write issues more like acceptance notes:

1. Describe the visible problem: “After scrolling, the navigation covers the case title.”
2. State the expected result: “The title should remain fully visible. Keeping or removing the nav is acceptable.”
3. Set boundaries: “Do not change the overall visual style. Only fix the overlap.”
4. Ask for verification: “Check 390, 768, 1440, and 2560 widths, and report the result.”
5. Return to product judgment when a fix keeps failing. That is what happened with sticky navigation. I removed it because the reading experience mattered more.

This was a useful lesson. I do not need to write React to work better with AI, but I need to define problems clearly. CSS is an engineering language. Acceptance criteria are a language I can own as a PMO.

AI can write and revise code. I still need to decide what “fixed” means.

---

## 6. My Updated View of Vibe Coding

I now see Vibe Coding as AI-assisted development guided by product judgment.

It needs intuition, but it also needs constraints. Intuition notices that something feels wrong. Constraints turn that feeling into a task AI can execute.

I no longer expect one prompt to produce the final result. A better process is to give AI a clear working frame, then tighten the result through review.

AI is fast and helpful. It is also very willing to complete the wrong direction. That means the human role is not only to ask for more. Sometimes the human role is to stop, simplify, or remove.

---

## 7. What I Would Prepare Next Time

For a similar project, I would prepare six things before coding:

1. PRD: audience, page goals, and success criteria.
2. Design system contract: type, color, heading scale, cards, buttons, and responsive rules.
3. Content model: fields and structure for each case study.
4. Component plan: hero, cases, method, education, journal, and contact.
5. Interaction rules: where motion is useful and where the page should stay quiet.
6. Acceptance checklist: desktop, mobile, foldable screens, light mode, dark mode, and anchor navigation.

This would make the start slower, but the later work much cleaner.

---

## 8. What I’m Taking Forward

This project taught me that AI Coding is not only a coding problem. It is also a problem-definition problem.

For a PMO without a traditional coding background, the practical path is not to become a front-end engineer overnight. The practical path is to manage AI output with product language, design language, and clear acceptance criteria.

I need to know what I want. I also need to know when to stop.  
That may be the most useful lesson from this build.

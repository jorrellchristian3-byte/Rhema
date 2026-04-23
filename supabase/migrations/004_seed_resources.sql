-- ============================================
-- Rhema — Seed Resources
-- Public domain commentaries, theologian quotes, and curated videos
-- ============================================

-- ═══ COMMENTARIES (Matthew Henry's Concise Commentary — Public Domain) ═══

INSERT INTO public.commentaries (author, title, book, chapter_start, chapter_end, content, source_url, is_public_domain) VALUES

('Matthew Henry', 'Commentary on Genesis 1', 'Genesis', 1, 1,
'The first verse of the Bible gives us a satisfying and useful account of the origin of the earth and the heavens. The faith of humble Christians understands this better than the fancy of the most learned men. From what we see of heaven and earth, we learn the power of the great Creator. And let our make and place, as men, remind us of our duty as Christians, always to keep heaven in our eye, and the earth under our feet.',
'https://www.ccel.org/ccel/henry/mhc1.Gen.ii.html', true),

('Matthew Henry', 'Commentary on Genesis 3', 'Genesis', 3, 3,
'Satan tempted Eve, that by her he might tempt Adam. The tempter was the devil, in the shape and likeness of a serpent. Satan''s plan was to draw our first parents to sin, and so to separate between them and their God. Thus the devil was from the beginning a murderer, and the great mischief-maker. The whole human race being ruined by the fall of our first parents, the Son of God graciously undertook to be the Deliverer.',
'https://www.ccel.org/ccel/henry/mhc1.Gen.iv.html', true),

('Matthew Henry', 'Commentary on Exodus 20', 'Exodus', 20, 20,
'God speaks many ways to the children of men; by conscience, by providences, by his voice, to all which we ought carefully to attend; but he never spake at any time so as he spake the ten commandments. This law God had given to man before; it was written in his heart; but sin so defaced it, that it was needful to revive the knowledge of it.',
'https://www.ccel.org/ccel/henry/mhc1.Ex.xxi.html', true),

('Matthew Henry', 'Commentary on Psalm 23', 'Psalms', 23, 23,
'Great care God takes of believers. The Lord is their shepherd. They shall be supplied with whatever they need. He will protect them. The psalmist had felt the truth of the promise, and he delights to think of it. He had his fears, but his faith was an anchor to his soul. In the valley of the shadow of death he feared no evil. This is applicable to the troubles of life and to the hour of death.',
'https://www.ccel.org/ccel/henry/mhc3.Ps.xxiv.html', true),

('Matthew Henry', 'Commentary on Isaiah 53', 'Isaiah', 53, 53,
'This chapter is so replenished with the unsearchable riches of Christ, that it may be called rather the gospel of the evangelist Isaiah, than the prophecy of the prophet Isaiah. Here the Messiah is described as a man of sorrows, acquainted with grief, wounded for our transgressions, bruised for our iniquities; upon him was the chastisement that brought us peace, and by his stripes we are healed.',
'https://www.ccel.org/ccel/henry/mhc4.Is.liv.html', true),

('Matthew Henry', 'Commentary on John 1', 'John', 1, 1,
'The plainest reason why the Son of God is called the Word, seems to be, that as our words explain our minds to others, so was the Son of God sent in order to reveal his Father''s mind to the world. What the evangelist says of Christ proves that he is God. He asserts his existence in the beginning; his co-existence with the Father. The Word was God. This Word was made flesh. And this proves that he is God.',
'https://www.ccel.org/ccel/henry/mhc6.John.ii.html', true),

('Matthew Henry', 'Commentary on John 3', 'John', 3, 3,
'Jesus'' discourse with Nicodemus is one of the most important passages in all of Scripture. The new birth is a mystery. We cannot trace the manner of its operation, but we know it by its fruits. Christ''s being lifted up upon the cross, was designed for the healing of the nations. And as Moses'' serpent was lifted up, so must the Son of man be lifted up, that those who believe might have eternal life. God so loved the world that He gave His only begotten Son.',
'https://www.ccel.org/ccel/henry/mhc6.John.iv.html', true),

('Matthew Henry', 'Commentary on Romans 8', 'Romans', 8, 8,
'Believers may be chastened of the Lord, but will not be condemned with the world. By the Spirit the deeds of the body are mortified. All who are led by the Spirit of God are sons of God. The Spirit witnesses with our spirit that we are children of God. If children, then heirs — heirs of God and joint heirs with Christ. We know that all things work together for good to those who love God.',
'https://www.ccel.org/ccel/henry/mhc6.Rom.ix.html', true),

('Matthew Henry', 'Commentary on 1 Corinthians 13', '1 Corinthians', 13, 13,
'The apostle shows what is the more excellent way. Without charity or love, the most glorious gifts are of no account to us. He shows what is the nature and temper of charity. And what is the excellence thereof: it never faileth. Here we see its continuance. Charity is a grace which will endure to eternity. Love is the fulfilling of the law.',
'https://www.ccel.org/ccel/henry/mhc6.iCor.xiv.html', true),

('Matthew Henry', 'Commentary on Revelation 21', 'Revelation', 21, 21,
'A new heaven and new earth are promised. Former things are done away. All is new. God shall dwell among men. He will wipe away all tears from their eyes. There shall be no more death, sorrow, or pain. The holy city, new Jerusalem, comes down from God out of heaven. The glory of God lightens it, and the Lamb is its light. The nations of them that are saved shall walk in the light of it.',
'https://www.ccel.org/ccel/henry/mhc6.Rev.xxii.html', true);


-- ═══ THEOLOGIAN QUOTES (Public Domain) ═══

INSERT INTO public.quotes (author, author_era, text, source_title, scripture_references, tags) VALUES

('Augustine of Hippo', 'Early Church',
'Thou hast made us for Thyself, O Lord, and our hearts are restless until they rest in Thee.',
'Confessions', '[{"book":"Psalms","chapter":62,"verseStart":1}]'::jsonb,
ARRAY['rest', 'purpose', 'devotion']),

('Augustine of Hippo', 'Early Church',
'The Holy Scriptures are our letters from home.',
'Homilies on the First Epistle of John', '[{"book":"2 Timothy","chapter":3,"verseStart":16}]'::jsonb,
ARRAY['scripture', 'devotion']),

('Martin Luther', 'Reformation',
'The Bible is alive, it speaks to me; it has feet, it runs after me; it has hands, it lays hold of me.',
'Table Talk', '[{"book":"Hebrews","chapter":4,"verseStart":12}]'::jsonb,
ARRAY['scripture', 'faith']),

('Martin Luther', 'Reformation',
'Faith is a living, daring confidence in God''s grace, so sure and certain that a man could stake his life on it a thousand times.',
'Preface to Romans', '[{"book":"Romans","chapter":5,"verseStart":1,"verseEnd":2}]'::jsonb,
ARRAY['faith', 'grace', 'salvation']),

('John Calvin', 'Reformation',
'There is not one blade of grass, there is no color in this world that is not intended to make us rejoice.',
'Sermon on Deuteronomy', '[{"book":"Genesis","chapter":1,"verseStart":31}]'::jsonb,
ARRAY['creation', 'joy', 'nature']),

('John Calvin', 'Reformation',
'Man''s nature, so to speak, is a perpetual factory of idols.',
'Institutes of the Christian Religion', '[{"book":"Exodus","chapter":20,"verseStart":3,"verseEnd":5}]'::jsonb,
ARRAY['idolatry', 'sin', 'human-nature']),

('Charles Spurgeon', 'Victorian',
'A Bible that''s falling apart usually belongs to someone who isn''t.',
'Lectures to My Students', '[{"book":"Psalms","chapter":119,"verseStart":11}]'::jsonb,
ARRAY['scripture', 'devotion', 'discipline']),

('Charles Spurgeon', 'Victorian',
'I have learned to kiss the wave that throws me against the Rock of Ages.',
'Sermons', '[{"book":"Romans","chapter":8,"verseStart":28}]'::jsonb,
ARRAY['suffering', 'trust', 'faith']),

('Charles Spurgeon', 'Victorian',
'Nobody ever outgrows Scripture; the book widens and deepens with our years.',
'Sermons', '[{"book":"Psalms","chapter":19,"verseStart":7,"verseEnd":11}]'::jsonb,
ARRAY['scripture', 'growth']),

('John Wesley', 'Evangelical Revival',
'Do all the good you can, by all the means you can, in all the ways you can, in all the places you can, at all the times you can, to all the people you can, as long as ever you can.',
'Letters', '[{"book":"Galatians","chapter":6,"verseStart":10}]'::jsonb,
ARRAY['service', 'christian-life', 'good-works']),

('A.W. Tozer', 'Modern',
'What comes into our minds when we think about God is the most important thing about us.',
'The Knowledge of the Holy', '[{"book":"John","chapter":17,"verseStart":3}]'::jsonb,
ARRAY['god', 'worship', 'knowledge']),

('C.S. Lewis', 'Modern',
'I believe in Christianity as I believe that the sun has risen: not only because I see it, but because by it I see everything else.',
'Is Theology Poetry?', '[{"book":"John","chapter":1,"verseStart":4,"verseEnd":5}]'::jsonb,
ARRAY['faith', 'apologetics', 'worldview']),

('Dietrich Bonhoeffer', 'Modern',
'Cheap grace is grace without discipleship, grace without the cross, grace without Jesus Christ.',
'The Cost of Discipleship', '[{"book":"Luke","chapter":14,"verseStart":27}]'::jsonb,
ARRAY['grace', 'discipleship', 'cross']),

('J.C. Ryle', 'Victorian',
'A man may go to heaven without health, without riches, without honors, without learning, without friends; but he can never go there without Christ.',
'Holiness', '[{"book":"John","chapter":14,"verseStart":6}]'::jsonb,
ARRAY['salvation', 'christ', 'faith']),

('Jonathan Edwards', 'Great Awakening',
'Resolution One: I will live for God. Resolution Two: If no one else does, I still will.',
'Resolutions', '[{"book":"Joshua","chapter":24,"verseStart":15}]'::jsonb,
ARRAY['devotion', 'commitment', 'faith']);


-- ═══ CURATED VIDEOS (Free Bible teaching channels) ═══

INSERT INTO public.videos (title, url, provider, channel, description, duration_seconds, scripture_references, tags, thumbnail_url) VALUES

('The Book of Genesis Overview (Part 1)', 'https://www.youtube.com/watch?v=GQI72THyO5I', 'youtube',
'BibleProject', 'An animated overview of Genesis 1-11, covering creation, the fall, the flood, and the tower of Babel.',
480, '[{"book":"Genesis","chapter":1},{"book":"Genesis","chapter":3},{"book":"Genesis","chapter":6}]'::jsonb,
ARRAY['overview', 'genesis', 'creation', 'old-testament'],
'https://i.ytimg.com/vi/GQI72THyO5I/maxresdefault.jpg'),

('The Book of Genesis Overview (Part 2)', 'https://www.youtube.com/watch?v=F4isSyennFo', 'youtube',
'BibleProject', 'An animated overview of Genesis 12-50, covering Abraham, Isaac, Jacob, and Joseph.',
480, '[{"book":"Genesis","chapter":12},{"book":"Genesis","chapter":22},{"book":"Genesis","chapter":37}]'::jsonb,
ARRAY['overview', 'genesis', 'abraham', 'old-testament'],
'https://i.ytimg.com/vi/F4isSyennFo/maxresdefault.jpg'),

('The Gospel of John Overview', 'https://www.youtube.com/watch?v=G-2e9mMf7E8', 'youtube',
'BibleProject', 'An animated overview of the entire Gospel of John, exploring its unique portrait of Jesus.',
600, '[{"book":"John","chapter":1},{"book":"John","chapter":3},{"book":"John","chapter":20}]'::jsonb,
ARRAY['overview', 'john', 'gospel', 'new-testament'],
'https://i.ytimg.com/vi/G-2e9mMf7E8/maxresdefault.jpg'),

('The Book of Romans Overview (Part 1)', 'https://www.youtube.com/watch?v=ej_6dVdJSIU', 'youtube',
'BibleProject', 'An animated overview of Romans 1-4, exploring Paul''s thesis on the gospel and righteousness by faith.',
480, '[{"book":"Romans","chapter":1},{"book":"Romans","chapter":3}]'::jsonb,
ARRAY['overview', 'romans', 'gospel', 'new-testament'],
'https://i.ytimg.com/vi/ej_6dVdJSIU/maxresdefault.jpg'),

('Psalm 23 — The Lord is My Shepherd', 'https://www.youtube.com/watch?v=bXNoJOFUlOA', 'youtube',
'BibleProject', 'Exploring the imagery and theology behind David''s most beloved psalm.',
360, '[{"book":"Psalms","chapter":23}]'::jsonb,
ARRAY['psalms', 'shepherd', 'comfort'],
'https://i.ytimg.com/vi/bXNoJOFUlOA/maxresdefault.jpg'),

('Isaiah 53 — The Suffering Servant', 'https://www.youtube.com/watch?v=_TzdEPuqgQo', 'youtube',
'BibleProject', 'How Isaiah''s portrait of the suffering servant finds its fulfillment in Jesus.',
420, '[{"book":"Isaiah","chapter":53}]'::jsonb,
ARRAY['isaiah', 'messianic', 'prophecy', 'old-testament'],
'https://i.ytimg.com/vi/_TzdEPuqgQo/maxresdefault.jpg');


-- ═══ ARTICLES (Free resources) ═══

INSERT INTO public.articles (title, author, url, source, description, scripture_references, tags, is_free) VALUES

('Genesis 1 — Commentary', 'Various Authors', 'https://www.blueletterbible.org/Comm/mhc/Gen/Gen_001.cfm', 'Blue Letter Bible',
'Matthew Henry''s complete commentary on Genesis chapter 1, covering creation.',
'[{"book":"Genesis","chapter":1}]'::jsonb, ARRAY['genesis', 'creation', 'commentary'], true),

('John 3:16 — Word Study', 'Various Authors', 'https://www.blueletterbible.org/lexicon/g26/kjv/tr/0-1/', 'Blue Letter Bible',
'Greek word study on agapao (love) as used in John 3:16.',
'[{"book":"John","chapter":3,"verseStart":16}]'::jsonb, ARRAY['john', 'love', 'greek', 'word-study'], true),

('Romans 8 — No Condemnation', 'John Piper', 'https://www.desiringgod.org/messages/there-is-therefore-now-no-condemnation', 'Desiring God',
'A sermon manuscript exploring the depths of Romans 8:1 and freedom from condemnation.',
'[{"book":"Romans","chapter":8,"verseStart":1}]'::jsonb, ARRAY['romans', 'salvation', 'grace', 'sermon'], true),

('Psalm 23 for the 21st Century', 'Timothy Keller', 'https://www.thegospelcoalition.org/article/the-lord-is-my-shepherd/', 'The Gospel Coalition',
'A modern reflection on Psalm 23 and its relevance to contemporary anxieties.',
'[{"book":"Psalms","chapter":23}]'::jsonb, ARRAY['psalms', 'comfort', 'anxiety', 'devotion'], true);

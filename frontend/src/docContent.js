// Each document has an id, title, and sections.
// To add a new guide in future, just add another entry here.

export const DOC_ID = 'beastlord-guide-v1';

export const DOC = {
  id: DOC_ID,
  title: "The Complete Beastlord's Compendium",
  subtitle: "A community-reviewed guide for EverQuest's warder class",
  sections: [
    {
      id: 'intro',
      heading: 'What is a Beastlord?',
      sentences: [
        'The Beastlord is a hybrid melee and pet class introduced in the Shadows of Luclin expansion.',
        'They combine powerful melee combat with a warder pet and shamanic support spells.',
        'Beastlords are unique in that their pet, called a warder, scales up alongside them as they level.',
        'Their primary stats are Strength and Dexterity for melee, with Wisdom governing their mana pool.',
      ],
    },
    {
      id: 'race',
      heading: 'Choosing your race',
      sentences: [
        'Iksar Beastlords are widely considered the strongest choice due to their innate regeneration and armor class bonus.',
        'Vah Shir are the only Beastlord race with access to the feline warder, which many players prefer for flavor.',
        'Barbarian Beastlords have the highest starting Strength but lack the Iksar regeneration bonus.',
        'Ogres can also play Beastlords and benefit from Bash and frontal stun immunity.',
      ],
    },
    {
      id: 'warder',
      heading: 'Your warder pet',
      sentences: [
        'Your warder is your most important combat tool — always keep it summoned.',
        'Warder focus items, found on various drops and vendors, dramatically increase your pet\'s damage output.',
        'Buffing your warder with Haste and DS spells makes it one of the strongest DPS pets in the game.',
        'If your warder dies, resummon it immediately; a dead warder is a massive DPS loss.',
        'At higher levels, your warder gains new abilities automatically as you gain experience.',
      ],
    },
    {
      id: 'rotation',
      heading: 'Combat rotation',
      sentences: [
        'Send your warder in first to establish aggro before you engage in melee.',
        'Use Ferocity of Spirit to boost your warder\'s damage after it has locked aggro on the target.',
        'Slow the mob with Drowsy or Sha\'s Legacy as soon as possible to reduce incoming damage.',
        'Weave in Claw of the Savage Spirit on cooldown for extra damage.',
        'Prioritize healing your warder over dealing damage if you are in a long fight without a healer.',
      ],
    },
    {
      id: 'gear',
      heading: 'Gear priorities',
      sentences: [
        'Focus on Strength and Dexterity augments to improve your melee output.',
        'A Primal Velium weapon is a strong early weapon choice and relatively easy to obtain.',
        'Beastlords benefit greatly from Haste gear — aim for the cap of 100% as early as possible.',
        'Do not neglect Wisdom on your gear, as running out of mana will cut your effectiveness significantly.',
      ],
    },
  ],
};

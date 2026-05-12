// Beastlord SOR Guide — Community Voting Content
// To update this content, edit the sentences arrays below.
// Each sentence becomes its own rateable unit in sentence mode.

export const DOC_ID = 'beastlord-sor-guide-v1';

export const DOC = {
  id: DOC_ID,
  title: "SOR Beastlord Basics",
  subtitle: "A quick and dirty guide to doing decent DPS — community reviewed",
  sections: [
    {
      id: 'spells',
      heading: 'SOR Spell List',
      sentences: [
        'All new and updated SOR spells: Venomous Covariance, Dichotomic Fury, Pack Leader\'s Protection, Protective Warder, Focus of Aramna, Aegis of Valorforged, Auspice of Usira, Spellbreaker\'s Guard XI, Spirit of Tala\'tak, Warder\'s Unity, Pack Leader\'s Aggression, Shared Merciless Ferocity, Spiritual Enlightenment XVII, and Spirit of Orvain.',
        'Use Pack Leader\'s Aggression for raids and Pack Leader\'s Protection for pet tanking — they do not stack with each other.',
        'Focus of Aramna is typically redundant if your shaman already has Heroic focusing.',
        'Auspice of Usira and Spellbreaker\'s Guard XI are not worth rebuffing mid-raid.',
        'Warder\'s Unity combines pet haste with a new proc.',
        'Natural Alliance can be clicked with the Feralist\'s Unity AA instead of casting it.',
      ],
    },
    {
      id: 'pre-dps',
      heading: 'Pre-DPS Setup',
      sentences: [
        'Use a Draught of Shattered Evocations (or Spider\'s Bite XXIII) before engaging.',
        'Hit Taste of Blood on zone in.',
        'Hit the Protective Warder AA.',
        'Gear your pet with 2 weapons plus a Dimensional Warrior Belt and Greaves (or Conflagrant equivalents).',
        'Make sure Tribute is on.',
        'Bank a Taste of Blood for 2 potential AE group paragons per raid — it is consumed on death, zone, or when a group buff is used.',
        'Click Consumption before the engage to avoid accidentally triggering it during a burn.',
        'For raid spells: replace Hoarfrost Roar with anything else if AE is NOT OK, and replace Feralgia with Growl if swarm pets are NOT OK.',
      ],
    },
    {
      id: 'raid-spells',
      heading: 'Raid Spell Lineup',
      sentences: [
        'Core raid spell lineup: Venomous Covariance, Dichotomic Fury, Grimclaw\'s Feralgia, Spiter Blood, Shar\'Drahn\'s Chill, Tsetsian Endemic XII, Khrosik\'s Bite, Tallongast\'s Maelstrom, Frigid Lance XII, Glacial Roar IX, Frozen Venom X, Shared Merciless Ferocity, Spiritual Enlightenment XVII, and Lydora\'s Mending.',
        'Shared Merciless Ferocity, Spiritual Enlightenment XVII, and Lydora\'s Mending are the slots most often swapped out when you need flexibility.',
        'Dichotomic Fury is recommended over other fury options as it costs the least mana — Reciprocal is the newest fury alternative if you prefer it.',
      ],
    },
    {
      id: 'burn1',
      heading: 'Burn Phase 1 — Big Burn',
      sentences: [
        'Typically burn from the very start of an engagement.',
        'Click Dicho + Covariance + Bestial Alignment + all big burn buttons except Ruaabri, then tap the mash button once on global spell cooldown.',
        'Click Ruaabri when the first Dicho fades.',
        'Click Dicho again when Ruaabri fades.',
        'Click Covariance + Forceful Rejuvenation, then click Dicho + Covariance again.',
        'The goal is to keep HHE buffs up as long as possible while running hit mod discs and abilities (SPA v185).',
        'Try to time your discs in line with shaman and bard epics.',
        'Big Burn bonus: use Protective Spirit to avoid dying to aggro and watch the aggro meter to time FDs.',
        'Use Bifold on global spell cooldown followed by Chill, then spam Blood repeatedly — it is the best nuke and instant cast.',
        'Use Chill instead of Blood for some mana savings.',
      ],
    },
    {
      id: 'burn234',
      heading: 'Burn Phases 2, 3, and 4',
      sentences: [
        'Burn Phase 2 — Savage Rancor: activate once Bestial Alignment fades. A countdown trigger or notification for faded discs is highly recommended.',
        'From Burn Phase 2 onward, keep Dichotomic Fury running on cooldown at all times.',
        'Burn Phase 3 — Ferociousness + Omens of War BP: activate when Savage Rancor fades.',
        'Burn Phase 4 — GBA: activate when Ferociousness fades.',
        'Burn phases 2 through 4 should be refreshed on cooldown or cycled with the group as needed.',
        'Do not use Group BA if the ranger\'s Group Guardian is running — they do not stack.',
      ],
    },
    {
      id: 'mash',
      heading: 'Mash Button & Between Burns',
      sentences: [
        'After burn phases 1 and 2 are complete, regularly tap your bind key and refresh Dichotomic Fury on cooldown.',
        'Once burns are over or between cooldown periods mid-raid, use Feralgia or Growl and keep it up at all times for the hit mod — it has a 2 minute duration.',
        'Try to keep your 3 DoTs up on the main target and 1 to 2 DoTs on adds that you expect to last longer than 3 ticks.',
        'Having a trigger to warn you when DoTs fade is strongly recommended.',
        'If you have extra mana, DoT.',
      ],
    },
    {
      id: 'mana',
      heading: 'Mana Management',
      sentences: [
        'Mana management is critically important — start cycling through all mana recovery tools at around 90% mana.',
        'Always keep Focused Paragon on yourself unless a group paragon rotation is already running.',
        'You can typically start the group paragon rotation at the beginning of a raid.',
        'Use GoM procs on Dicho, Covariance, or a Poison DoT.',
        'Use Consumption of Spirit and Mod Rod on cooldown — these can be added to the mash button.',
        'Use Feather and Horn on cooldown but avoid overlapping them.',
        'Additional mana sources: Kotahl\'s Tonic of Clarity (mage), Valiant Restoration Serum, Heroic Rejuvenation Tincture, Champion\'s Restorative, Crusader, Xygoz Tonic, Mantle of Inasch, and mana glyph.',
      ],
    },
    {
      id: 'other',
      heading: 'Other Tips',
      sentences: [
        'Do not bother micromanaging GoM — focus on timers and keeping up with buttons.',
        'After Ruchu (shaman epic) fades during a burn, use Power Glyph — ideally 7th or later.',
        'You can mash away at the keybind when not big burning, just watch your mana. Mash key nuke DPS is best during Quick Time and should be limited during off periods.',
        'Barrage of Claws can be replaced with Focused Clamor of Claws to avoid AE frontal damage if needed, but always opt for Barrage when possible.',
        'Exclude Attack Warders if swarm pets are not allowed.',
        'For TB Paragon, try to use it early and avoid overlapping with others.',
        'For MGB Paragon, avoid overlap and use it later in the raid — roughly 10 minutes after TB. You can bank it immediately after using your TB.',
        'Only keep a heal up for runaway situations — AE and group healing should cover the raid.',
        'Expect aggro if you are hitting buttons. Use defensive discs freely. Use Playing Possum and False Death as needed.',
        'Synergy is very important — it procs off Harrow XII if your Synergy AA are maxed. If not maxed, use the ability that will proc it.',
        'Roar of Thunder is back on the menu for minor additional damage.',
        'Set Autoskill to Round Kick (Feral Swipe) and Tiger Claw (Raven\'s Claw for attack debuff) or Eagle\'s Strike (Bite of the Asp for extra damage).',
      ],
    },
  ],
};

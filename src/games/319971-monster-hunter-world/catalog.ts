import type { HunterCharacter } from '../../types/campaign';

export type ArmorSlot = 'helm' | 'mail' | 'greaves';

/** Path relative to `./assets/` */
export type AssetPath = string;

export interface EquipmentDef {
  id: string;
  name: string;
  category: 'weapon' | 'armor';
  icon: AssetPath;
  /** Required when category is armor */
  armorSlot?: ArmorSlot;
  /** Omit / empty = available to every character */
  characters?: HunterCharacter[];
}

export const ARMOR_SLOTS: Array<{ id: ArmorSlot; label: string }> = [
  { id: 'helm', label: 'Helm' },
  { id: 'mail', label: 'Mail' },
  { id: 'greaves', label: 'Greaves' },
];

export interface ItemDef {
  id: string;
  name: string;
  group: string;
  icon: AssetPath;
}

export const HUNTER_CHARACTERS: Array<{
  id: HunterCharacter;
  label: { en: string; 'zh-TW': string };
}> = [
  { id: 'bow', label: { en: 'Bow', 'zh-TW': '弓' } },
  { id: 'dual-blades', label: { en: 'Dual Blades', 'zh-TW': '雙劍' } },
  { id: 'great-sword', label: { en: 'Great Sword', 'zh-TW': '大劍' } },
  {
    id: 'sword-and-shield',
    label: { en: 'Sword & Shield', 'zh-TW': '片手劍' },
  },
];

function weapon(
  id: string,
  name: string,
  character: HunterCharacter,
  icon: AssetPath,
): EquipmentDef {
  return { id, name, category: 'weapon', characters: [character], icon };
}

function armor(
  id: string,
  name: string,
  armorSlot: ArmorSlot,
  icon: AssetPath,
): EquipmentDef {
  return { id, name, category: 'armor', armorSlot, icon };
}

function item(
  id: string,
  name: string,
  group: string,
  icon: AssetPath,
): ItemDef {
  return { id, name, group, icon };
}

/** Full equipment catalog — extend in this file as needed. */
export const EQUIPMENT_CATALOG: EquipmentDef[] = [
  // Bow
  weapon('iron-bow', 'Iron Bow', 'bow', 'Item/Weapons/ItemIcon042.webp'),
  weapon('steel-bow', 'Steel Bow', 'bow', 'Item/Weapons/ItemIcon042.webp'),
  weapon('hunters-bow', "Hunter's Bow", 'bow', 'Item/Weapons/ItemIcon042.webp'),
  weapon(
    'hunters-stoutbow',
    "Hunter's Stoutbow",
    'bow',
    'Item/Weapons/ItemIcon042.webp',
  ),
  weapon('alloy-bow', 'Alloy Bow', 'bow', 'Item/Weapons/ItemIcon042a.webp'),
  weapon(
    'hunters-proudbow',
    "Hunter's Proudbow",
    'bow',
    'Item/Weapons/ItemIcon042a.webp',
  ),
  weapon('pulsar-bow', 'Pulsar Bow', 'bow', 'Item/Weapons/ItemIcon042a.webp'),
  weapon('blazing-bow', 'Blazing Bow', 'bow', 'Item/Weapons/ItemIcon042a.webp'),
  weapon(
    'blooming-arch',
    'Blooming Arch',
    'bow',
    'Item/Weapons/ItemIcon042a.webp',
  ),
  weapon('diablos-bow', 'Diablos Bow', 'bow', 'Item/Weapons/ItemIcon042a.webp'),
  weapon('kulu-arrow', 'Kulu Arrow', 'bow', 'Item/Weapons/ItemIcon042a.webp'),
  weapon(
    'flying-kadachi-strikebow',
    'Flying Kadachi Strikebow',
    'bow',
    'Item/Weapons/ItemIcon042g.webp',
  ),
  weapon('anja-arch', 'Anja Arch', 'bow', 'Item/Weapons/ItemIcon042g.webp'),
  weapon(
    'datura-string',
    'Datura String',
    'bow',
    'Item/Weapons/ItemIcon042g.webp',
  ),
  weapon(
    'diablos-colibender',
    'Diablos Colibender',
    'bow',
    'Item/Weapons/ItemIcon042g.webp',
  ),
  weapon(
    'archers-dance',
    "Archer's Dance",
    'bow',
    'Item/Weapons/ItemIcon042g.webp',
  ),
  weapon(
    'icesteel-bow',
    'Icesteel Bow',
    'bow',
    'Item/Weapons/ItemIcon042g.webp',
  ),
  weapon(
    'daoras-sagittarii',
    "Daora's Sagittarii",
    'bow',
    'Item/Weapons/ItemIcon042d.webp',
  ),
  weapon(
    'nergal-whisper',
    'Nergal Whisper',
    'bow',
    'Item/Weapons/ItemIcon042d.webp',
  ),
  weapon(
    'dooms-shaft',
    "Doom's Shaft",
    'bow',
    'Item/Weapons/ItemIcon042d.webp',
  ),

  // Dual Blades
  weapon(
    'matched-slicers',
    'Matched Slicers',
    'dual-blades',
    'Item/Weapons/ItemIcon035.webp',
  ),
  weapon(
    'dual-slicers',
    'Dual Slicers',
    'dual-blades',
    'Item/Weapons/ItemIcon035f.webp',
  ),
  weapon(
    'bone-hatchets',
    'Bone Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035f.webp',
  ),
  weapon(
    'wild-hatchets',
    'Wild Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035f.webp',
  ),
  weapon(
    'chrome-slicers',
    'Chrome Slicers',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'strong-hatchets',
    'Strong Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'pulsar-hatchets',
    'Pulsar Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'blazing-hatchets',
    'Blazing Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'madness-pangas',
    'Madness Pangas',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'diablos-hatchets',
    'Diablos Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'rending-beaks',
    'Rending Beaks',
    'dual-blades',
    'Item/Weapons/ItemIcon035a.webp',
  ),
  weapon(
    'kadachi-claws',
    'Kadachi Claws',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'anja-cyclone',
    'Anja Cyclone',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'jyura-hatchets',
    'Jyura Hatchets',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'diablos-clubs',
    'Diablos Clubs',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'arcanaria',
    'Arcanaria',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'twin-nails-teostra',
    'Twin Nails (Teostra)',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'twin-nails-kushala',
    'Twin Nails (Kushala)',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'nergal-gouge',
    'Nergal Gouge',
    'dual-blades',
    'Item/Weapons/ItemIcon035g.webp',
  ),
  weapon(
    'fire-and-ice-teostra',
    'Fire and Ice (Teostra)',
    'dual-blades',
    'Item/Weapons/ItemIcon035d.webp',
  ),
  weapon(
    'fire-and-ice-kushala',
    'Fire and Ice (Kushala)',
    'dual-blades',
    'Item/Weapons/ItemIcon035d.webp',
  ),
  weapon(
    'decimation-claws',
    'Decimation Claws',
    'dual-blades',
    'Item/Weapons/ItemIcon035d.webp',
  ),

  // Great Sword
  weapon(
    'buster-sword',
    'Buster Sword',
    'great-sword',
    'Item/Weapons/ItemIcon029.webp',
  ),
  weapon(
    'buster-blade',
    'Buster Blade',
    'great-sword',
    'Item/Weapons/ItemIcon029f.webp',
  ),
  weapon(
    'bone-blade',
    'Bone Blade',
    'great-sword',
    'Item/Weapons/ItemIcon029f.webp',
  ),
  weapon(
    'bone-slasher',
    'Bone Slasher',
    'great-sword',
    'Item/Weapons/ItemIcon029f.webp',
  ),
  weapon(
    'chrome-razor',
    'Chrome Razor',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'giant-jawblade',
    'Giant Jawblade',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'jagras-blade',
    'Jagras Blade',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'flame-blade',
    'Flame Blade',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'blooming-blade',
    'Blooming Blade',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'carapace-buster',
    'Carapace Buster',
    'great-sword',
    'Item/Weapons/ItemIcon029d.webp',
  ),
  weapon(
    'jagras-hacker',
    'Jagras Hacker',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'red-wing',
    'Red Wing',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'datura-blaze',
    'Datura Blaze',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'barroth-shredder',
    'Barroth Shredder',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'icesteel-edge',
    'Icesteel Edge',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'nergal-judicator',
    'Nergal Judicator',
    'great-sword',
    'Item/Weapons/ItemIcon029g.webp',
  ),
  weapon(
    'daoras-decimator',
    "Daora's Decimator",
    'great-sword',
    'Item/Weapons/ItemIcon029b.webp',
  ),
  weapon(
    'purgations-atrocity',
    "Purgation's Atrocity",
    'great-sword',
    'Item/Weapons/ItemIcon029b.webp',
  ),

  // Sword & Shield
  weapon(
    'hunters-knife',
    "Hunter's Knife",
    'sword-and-shield',
    'Item/Weapons/ItemIcon034.webp',
  ),
  weapon(
    'steel-knife',
    'Steel Knife',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034f.webp',
  ),
  weapon(
    'bone-kukri',
    'Bone Kukri',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034f.webp',
  ),
  weapon(
    'chief-kukri',
    'Chief Kukri',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034f.webp',
  ),
  weapon(
    'chrome-slicer',
    'Chrome Slicer',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'grand-barong',
    'Grand Barong',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'blooming-knife',
    'Blooming Knife',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'carapace-edge',
    'Carapace Edge',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'jagras-edge',
    'Jagras Edge',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'flame-knife',
    'Flame Knife',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034a.webp',
  ),
  weapon(
    'datura-blossom',
    'Datura Blossom',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034g.webp',
  ),
  weapon(
    'barroth-club',
    'Barroth Club',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034g.webp',
  ),
  weapon(
    'jagras-garotte',
    'Jagras Garotte',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034g.webp',
  ),
  weapon(
    'heat-edge',
    'Heat Edge',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034g.webp',
  ),
  weapon(
    'teostras-spada',
    "Teostra's Spada",
    'sword-and-shield',
    'Item/Weapons/ItemIcon034g.webp',
  ),
  weapon(
    'teostras-emblem',
    "Teostra's Emblem",
    'sword-and-shield',
    'Item/Weapons/ItemIcon034d.webp',
  ),
  weapon(
    'negal-jack',
    'Negal Jack',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034d.webp',
  ),
  weapon(
    'eradication-vanguard',
    'Eradication Vanguard',
    'sword-and-shield',
    'Item/Weapons/ItemIcon034d.webp',
  ),

  // Armor (shared)
  armor('starter-helm', 'Starter Helm', 'helm', 'Item/Armor/ItemIcon002.webp'),
  armor('starter-mail', 'Starter Mail', 'mail', 'Item/Armor/ItemIcon037.webp'),
  armor(
    'starter-greaves',
    'Starter Greaves',
    'greaves',
    'Item/Armor/ItemIcon010.webp',
  ),
  armor('alloy-helm', 'Alloy Helm', 'helm', 'Item/Armor/ItemIcon002f.webp'),
  armor('alloy-mail', 'Alloy Mail', 'mail', 'Item/Armor/ItemIcon037f.webp'),
  armor(
    'alloy-greaves',
    'Alloy Greaves',
    'greaves',
    'Item/Armor/ItemIcon010f.webp',
  ),
  armor('anja-helm', 'Anja Helm', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('anja-mail', 'Anja Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'anja-greaves',
    'Anja Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor('barroth-helm', 'Barroth Helm', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('barroth-mail', 'Barroth Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'barroth-greaves',
    'Barroth Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor('bone-helm', 'Bone Helm', 'helm', 'Item/Armor/ItemIcon002f.webp'),
  armor('bone-mail', 'Bone Mail', 'mail', 'Item/Armor/ItemIcon037f.webp'),
  armor(
    'bone-greaves',
    'Bone Greaves',
    'greaves',
    'Item/Armor/ItemIcon010f.webp',
  ),
  armor('diablos-helm', 'Diablos Helm', 'helm', 'Item/Armor/ItemIcon002g.webp'),
  armor('diablos-mail', 'Diablos Mail', 'mail', 'Item/Armor/ItemIcon037g.webp'),
  armor(
    'diablos-greaves',
    'Diablos Greaves',
    'greaves',
    'Item/Armor/ItemIcon010g.webp',
  ),
  armor(
    'diablos-nero-helm',
    'Diablos Nero Helm',
    'helm',
    'Item/Armor/ItemIcon002g.webp',
  ),
  armor(
    'diablos-nero-mail',
    'Diablos Nero Mail',
    'mail',
    'Item/Armor/ItemIcon037g.webp',
  ),
  armor(
    'diablos-nero-greaves',
    'Diablos Nero Greaves',
    'greaves',
    'Item/Armor/ItemIcon010g.webp',
  ),
  armor('jagras-helm', 'Jagras Helm', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('jagras-mail', 'Jagras Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'jagras-greaves',
    'Jagras Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor('jyura-helm', 'Jyura Helm', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('jyura-mail', 'Jyura Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'jyura-greaves',
    'Jyura Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor('kadachi-helm', 'Kadachi Helm', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('kadachi-mail', 'Kadachi Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'kadachi-greaves',
    'Kadachi Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor('kaiser-crown', 'Kaiser Crown', 'helm', 'Item/Armor/ItemIcon002d.webp'),
  armor('kaiser-mail', 'Kaiser Mail', 'mail', 'Item/Armor/ItemIcon037d.webp'),
  armor(
    'kaiser-greaves',
    'Kaiser Greaves',
    'greaves',
    'Item/Armor/ItemIcon010d.webp',
  ),
  armor(
    'kulu-headpiece',
    'Kulu Headpiece',
    'helm',
    'Item/Armor/ItemIcon002a.webp',
  ),
  armor('kulu-mail', 'Kulu Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'kulu-greaves',
    'Kulu Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor(
    'kushala-glare',
    'Kushala Glare',
    'helm',
    'Item/Armor/ItemIcon002d.webp',
  ),
  armor(
    'kushala-cista',
    'Kushala Cista',
    'mail',
    'Item/Armor/ItemIcon037d.webp',
  ),
  armor(
    'kushala-crus',
    'Kushala Crus',
    'greaves',
    'Item/Armor/ItemIcon010d.webp',
  ),
  armor(
    'nergigante-helm',
    'Nergigante Helm',
    'helm',
    'Item/Armor/ItemIcon002d.webp',
  ),
  armor(
    'nergigante-mail',
    'Nergigante Mail',
    'mail',
    'Item/Armor/ItemIcon037d.webp',
  ),
  armor(
    'nergigante-greaves',
    'Nergigante Greaves',
    'greaves',
    'Item/Armor/ItemIcon010d.webp',
  ),
  armor('pukei-hood', 'Pukei Hood', 'helm', 'Item/Armor/ItemIcon002a.webp'),
  armor('pukei-mail', 'Pukei Mail', 'mail', 'Item/Armor/ItemIcon037a.webp'),
  armor(
    'pukei-greaves',
    'Pukei Greaves',
    'greaves',
    'Item/Armor/ItemIcon010a.webp',
  ),
  armor(
    'rath-soul-helm',
    'Rath Soul Helm',
    'helm',
    'Item/Armor/ItemIcon002g.webp',
  ),
  armor(
    'rath-soul-mail',
    'Rath Soul Mail',
    'mail',
    'Item/Armor/ItemIcon037g.webp',
  ),
  armor(
    'rath-soul-greaves',
    'Rath Soul Greaves',
    'greaves',
    'Item/Armor/ItemIcon010g.webp',
  ),
  armor(
    'rathalos-helm',
    'Rathalos Helm',
    'helm',
    'Item/Armor/ItemIcon002g.webp',
  ),
  armor(
    'rathalos-mail',
    'Rathalos Mail',
    'mail',
    'Item/Armor/ItemIcon037g.webp',
  ),
  armor(
    'rathalos-greaves',
    'Rathalos Greaves',
    'greaves',
    'Item/Armor/ItemIcon010g.webp',
  ),
];

export const ITEM_CATALOG: ItemDef[] = [
  // 1. Common
  item('ancient-bone', 'Ancient Bone', 'Common', 'Item/MonsterParts/ItemIcon008h.webp'),
  item('boulder-bone', 'Boulder Bone', 'Common', 'Item/MonsterParts/ItemIcon008c.webp'),
  item('carbalite-ore', 'Carbalite Ore', 'Common', 'Item/OresPicks/ItemIcon003g.webp'),
  item('dragonite-ore', 'Dragonite Ore', 'Common', 'Item/OresPicks/ItemIcon003h.webp'),
  item(
    'dragonvein-crystal',
    'Dragonvein Crystal',
    'Common',
    'Item/OresPicks/ItemIcon003i.webp',
  ),
  item('fucium-ore', 'Fucium Ore', 'Common', 'Item/OresPicks/ItemIcon003c.webp'),
  item('malachite-ore', 'Malachite Ore', 'Common', 'Item/OresPicks/ItemIcon003a.webp'),
  item(
    'monster-bone-large',
    'Monster Bone Large',
    'Common',
    'Item/MonsterParts/ItemIcon008c.webp',
  ),
  item(
    'monster-bone-medium',
    'Monster Bone Medium',
    'Common',
    'Item/MonsterParts/ItemIcon008c.webp',
  ),
  item(
    'monster-bone-small',
    'Monster Bone Small',
    'Common',
    'Item/MonsterParts/ItemIcon008c.webp',
  ),
  item(
    'monster-hardbone',
    'Monster Hardbone',
    'Common',
    'Item/MonsterParts/ItemIcon008f.webp',
  ),
  item(
    'monster-keenbone',
    'Monster Keenbone',
    'Common',
    'Item/MonsterParts/ItemIcon008g.webp',
  ),
  item('quality-bone', 'Quality Bone', 'Common', 'Item/MonsterParts/ItemIcon008.webp'),
  item(
    'wingrdrake-hide',
    'Wingrdrake Hide',
    'Common',
    'Item/MonsterParts/ItemIcon028.webp',
  ),

  // 2. Other Resources
  item('aqua-sac', 'Aqua Sac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item(
    'bird-wyvern-gem',
    'Bird Wyvern Gem',
    'Other Resources',
    'Item/ItemIcon025b.webp',
  ),
  item(
    'black-spiral-horn',
    'Black Spiral Horn',
    'Other Resources',
    'Item/MonsterParts/ItemIcon008b.webp',
  ),
  item(
    'blos-medulla',
    'Blos Medulla',
    'Other Resources',
    'Item/MonsterParts/ItemIcon008d.webp',
  ),
  item(
    'coral-crystal',
    'Coral Crystal',
    'Other Resources',
    'Item/OresPicks/ItemIcon003e.webp',
  ),
  item(
    'earth-crystal',
    'Earth Crystal',
    'Other Resources',
    'Item/OresPicks/ItemIcon003b.webp',
  ),
  item(
    'elder-dragon-blood',
    'Elder Dragon Blood',
    'Other Resources',
    'Item/PotionsRations/ItemIcon043d.webp',
  ),
  item(
    'elder-dragon-bone',
    'Elder Dragon Bone',
    'Other Resources',
    'Item/MonsterParts/ItemIcon008e.webp',
  ),
  item('electrosac', 'Electrosac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item('fertile-mud', 'Fertile Mud', 'Other Resources', 'Item/ItemIcon063a.webp'),
  item(
    'firecell-stone',
    'Firecell Stone',
    'Other Resources',
    'Item/OresPicks/ItemIcon003i.webp',
  ),
  item(
    'fire-dragon-scale',
    'Fire Dragon Scale',
    'Other Resources',
    'Item/MonsterParts/ItemIcon011h.webp',
  ),
  item('flame-sac', 'Flame Sac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item(
    'gajau-scale',
    'Gajau Scale',
    'Other Resources',
    'Item/MonsterParts/ItemIcon028e.webp',
  ),
  item(
    'immortal-dragonscale',
    'Immortal Dragonscale',
    'Other Resources',
    'Item/MonsterParts/ItemIcon011a.webp',
  ),
  item('inferno-sac', 'Inferno Sac', 'Other Resources', 'Item/ItemIcon045g.webp'),
  item(
    'majestic-horn',
    'Majestic Horn',
    'Other Resources',
    'Item/MonsterParts/ItemIcon036c.webp',
  ),
  item(
    'novacrystal',
    'Novacrystal',
    'Other Resources',
    'Item/OresPicks/ItemIcon003e.webp',
  ),
  item(
    'piercing-claw',
    'Piercing Claw',
    'Other Resources',
    'Item/MonsterParts/ItemIcon036e.webp',
  ),
  item('poison-sac', 'Poison Sac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item(
    'sharp-claw',
    'Sharp Claw',
    'Other Resources',
    'Item/MonsterParts/ItemIcon036.webp',
  ),
  item('thunder-sac', 'Thunder Sac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item('toxin-sac', 'Toxin Sac', 'Other Resources', 'Item/ItemIcon045e.webp'),
  item(
    'twister-horn',
    'Twister Horn',
    'Other Resources',
    'Item/MonsterParts/ItemIcon036g.webp',
  ),
  item(
    'warm-pelt',
    'Warm Pelt',
    'Other Resources',
    'Item/MonsterParts/ItemIcon028g.webp',
  ),
  item('wyvern-gem', 'Wyvern Gem', 'Other Resources', 'Item/ItemIcon025g.webp'),

  // 3. Monster Parts
  item(
    'great-jagras-claw',
    'Great Jagras Claw',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon036d.webp',
  ),
  item(
    'great-jagras-hide',
    'Great Jagras Hide',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon028e.webp',
  ),
  item(
    'great-jagras-mane',
    'Great Jagras Mane',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon021f.webp',
  ),
  item(
    'great-jagras-scale',
    'Great Jagras Scale',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon011e.webp',
  ),
  item(
    'tobi-kadachi-claw',
    'Tobi-Kadachi Claw',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon036g.webp',
  ),
  item(
    'tobi-kadachi-electrode',
    'Tobi-Kadachi Electrode',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon021e.webp',
  ),
  item(
    'tobi-kadachi-membrane',
    'Tobi-Kadachi Membrane',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon054.webp',
  ),
  item(
    'tobi-kadachi-pelt',
    'Tobi-Kadachi Pelt',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon028.webp',
  ),
  item(
    'tobi-kadachi-scale',
    'Tobi-Kadachi Scale',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon011.webp',
  ),
  item(
    'anjanath-fang',
    'Anjanath Fang',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon036g.webp',
  ),
  item(
    'anjanath-nosebone',
    'Anjanath Nosebone',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon008g.webp',
  ),
  item(
    'anjanath-pelt',
    'Anjanath Pelt',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon028b.webp',
  ),
  item(
    'anjanath-scale',
    'Anjanath Scale',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon011c.webp',
  ),
  item(
    'anjanath-tail',
    'Anjanath Tail',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon007c.webp',
  ),
  item(
    'rathalos-carapace',
    'Rathalos Carapace',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon028h.webp',
  ),
  item(
    'rathalos-marrow',
    'Rathalos Marrow',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon021i.webp',
  ),
  item(
    'rathalos-medulla',
    'Rathalos Medulla',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon021i.webp',
  ),
  item(
    'rathalos-plate',
    'Rathalos Plate',
    'Monster Parts',
    'Item/ItemIcon025a.webp',
  ),
  item(
    'rathalos-scale',
    'Rathalos Scale',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon011h.webp',
  ),
  item(
    'rathalos-shell',
    'Rathalos Shell',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon028h.webp',
  ),
  item(
    'rathalos-tail',
    'Rathalos Tail',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon007i.webp',
  ),
  item(
    'rathalos-webbing',
    'Rathalos Webbing',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon054f.webp',
  ),
  item(
    'rathalos-wing',
    'Rathalos Wing',
    'Monster Parts',
    'Item/ItemIcon025a.webp',
  ),
  item(
    'rathalos-wingtalon',
    'Rathalos Wingtalon',
    'Monster Parts',
    'Item/MonsterParts/ItemIcon036b.webp',
  ),
];

export function equipmentForCharacter(
  character: HunterCharacter,
): EquipmentDef[] {
  return EQUIPMENT_CATALOG.filter(
    (entry) =>
      !entry.characters ||
      entry.characters.length === 0 ||
      entry.characters.includes(character),
  );
}

export function getCharacterLabel(
  character: HunterCharacter,
  locale: 'en' | 'zh-TW',
): string {
  return (
    HUNTER_CHARACTERS.find((entry) => entry.id === character)?.label[locale] ??
    character
  );
}

/** Unique icon paths referenced by the catalogs (for asset cleanup). */
export function getMappedAssetPaths(): string[] {
  return [
    ...new Set([
      ...EQUIPMENT_CATALOG.map((entry) => entry.icon),
      ...ITEM_CATALOG.map((entry) => entry.icon),
    ]),
  ];
}

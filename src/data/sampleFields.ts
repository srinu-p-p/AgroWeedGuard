import { SampleFieldPreset } from '../types';

export const SAMPLE_FIELDS: SampleFieldPreset[] = [
  {
    id: 'field-cotton-01',
    name: 'Plot A4 - Bt Cotton (Vegetative V5)',
    cropType: 'Cotton',
    variety: 'Bt Cotton RCH-659',
    location: 'Central Farm Wardha, Maharashtra (20.7453° N, 78.6022° E)',
    growthStage: 'Vegetative (V4 - V6, 35 DAS)',
    soilType: 'Black Cotton Soil (Vertisol, high clay)',
    weather: 'Sunny, 31°C, 42% RH, Wind: 6 km/h NW',
    previousTreatment: 'Pendimethalin 38.7% CS pre-emergence applied 30 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?auto=format&fit=crop&w=400&q=80',
    description: 'Cotton crop showing heavy aggressive Palmer Amaranth broadleaf clusters emerging between rows after recent monsoon showers.',
    targetWeed: 'Palmer Amaranth (Amaranthus palmeri)',
    expectedCategory: 'Broadleaf Weeds',
    expectedSeverity: 'High',
    presetBoxes: [
      {
        id: 'box-cot-1',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Palmer Amaranth',
        confidence: 0.95,
        box: [28, 14, 58, 42]
      },
      {
        id: 'box-cot-2',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Palmer Amaranth',
        confidence: 0.92,
        box: [52, 60, 80, 88]
      },
      {
        id: 'box-cot-3',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Palmer Amaranth',
        confidence: 0.88,
        box: [18, 55, 42, 78]
      }
    ]
  },
  {
    id: 'field-maize-02',
    name: 'Sector 3 - Sweet Corn / Maize',
    cropType: 'Maize (Corn)',
    variety: 'Pioneer P3396 Hybrid',
    location: 'Agricultural Research Block, Guntur, AP (16.3067° N, 80.4365° E)',
    growthStage: 'V3 (3rd Collared Leaf, 22 DAS)',
    soilType: 'Red Sandy Loam, well-drained',
    weather: 'Partly Cloudy, 29°C, 58% RH, Wind: 8 km/h S',
    previousTreatment: 'Atrazine 50% WP applied at planting',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80',
    description: 'Maize seedling rows competing with early tillering Barnyardgrass colonies that survived residual atrazine due to moisture fluctuation.',
    targetWeed: 'Barnyardgrass (Echinochloa crus-galli)',
    expectedCategory: 'Grass Weeds',
    expectedSeverity: 'Moderate',
    presetBoxes: [
      {
        id: 'box-mz-1',
        weedClass: 'Grass Weeds',
        speciesName: 'Barnyardgrass',
        confidence: 0.93,
        box: [32, 22, 64, 48]
      },
      {
        id: 'box-mz-2',
        weedClass: 'Grass Weeds',
        speciesName: 'Barnyardgrass',
        confidence: 0.89,
        box: [58, 64, 82, 92]
      }
    ]
  },
  {
    id: 'field-rice-03',
    name: 'Delta Zone - Lowland Paddy Rice',
    cropType: 'Paddy Rice',
    variety: 'BPT 5204 (Samba Mahsuri)',
    location: 'Cauvery Basin, Thanjavur, Tamil Nadu (10.7870° N, 79.1378° E)',
    growthStage: 'Active Tillering (32 DAT)',
    soilType: 'Alluvial Heavy Clayey Silt',
    weather: 'Humid, 30°C, 75% RH, Wind: 5 km/h E',
    previousTreatment: 'Pretilachlor 50% EC standing water application at 3 DAT',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=400&q=80',
    description: 'Paddy field exhibiting dense patches of Yellow Nutsedge emerging in elevated, less flooded corners of the basin.',
    targetWeed: 'Yellow Nutsedge (Cyperus esculentus)',
    expectedCategory: 'Sedge Weeds',
    expectedSeverity: 'Severe',
    presetBoxes: [
      {
        id: 'box-rc-1',
        weedClass: 'Sedge Weeds',
        speciesName: 'Yellow Nutsedge',
        confidence: 0.96,
        box: [18, 12, 54, 44]
      },
      {
        id: 'box-rc-2',
        weedClass: 'Sedge Weeds',
        speciesName: 'Yellow Nutsedge',
        confidence: 0.91,
        box: [45, 48, 78, 82]
      },
      {
        id: 'box-rc-3',
        weedClass: 'Sedge Weeds',
        speciesName: 'Yellow Nutsedge',
        confidence: 0.87,
        box: [62, 10, 88, 38]
      }
    ]
  },
  {
    id: 'field-soybean-04',
    name: 'Block 7 - Soybean Grain Field',
    cropType: 'Soybean',
    variety: 'JS 335 Certified High-Yield',
    location: 'Malwa Plateau, Indore, Madhya Pradesh (22.7196° N, 75.8577° E)',
    growthStage: 'V4 (4th Trifoliate, 28 DAS)',
    soilType: 'Medium Deep Black Clay Soil',
    weather: 'Sunny & Clear, 27°C, 48% RH, Wind: 9 km/h NE',
    previousTreatment: 'Imazethapyr 10% SL post-emergence applied 12 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80',
    description: 'Soybean canopy with scattered Common Lambsquarters (Bathua) showing powdery whitish residue on young shoots.',
    targetWeed: 'Common Lambsquarters (Chenopodium album)',
    expectedCategory: 'Broadleaf Weeds',
    expectedSeverity: 'Moderate',
    presetBoxes: [
      {
        id: 'box-sb-1',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Common Lambsquarters',
        confidence: 0.92,
        box: [24, 30, 60, 68]
      },
      {
        id: 'box-sb-2',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Common Lambsquarters',
        confidence: 0.85,
        box: [55, 15, 82, 45]
      }
    ]
  },
  {
    id: 'field-wheat-05',
    name: 'Punjab Plain - Durum Wheat Field',
    cropType: 'Wheat',
    variety: 'PBW 550 Elite Wheat',
    location: 'Ludhiana Agricultural Belt, Punjab (30.9010° N, 75.8573° E)',
    growthStage: 'Tillering to Jointing (45 DAS)',
    soilType: 'Indo-Gangetic Alluvial Loam',
    weather: 'Cool Morning, 19°C, 62% RH, Wind: 4 km/h W',
    previousTreatment: 'Sulfosulfuron 75% WDG applied at 30 DAS',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80',
    description: 'Wheat tillers showing competitive Wild Oat grass weed intrusions along the irrigation channel lines.',
    targetWeed: 'Wild Oat (Avena fatua)',
    expectedCategory: 'Grass Weeds',
    expectedSeverity: 'Moderate',
    presetBoxes: [
      {
        id: 'box-wh-1',
        weedClass: 'Grass Weeds',
        speciesName: 'Wild Oat',
        confidence: 0.90,
        box: [30, 40, 70, 75]
      }
    ]
  },
  {
    id: 'field-tomato-06',
    name: 'Polyhouse Horticultural Tomato Plot',
    cropType: 'Tomato',
    variety: 'Abhinav Hybrid F1',
    location: 'Horticulture Corridor, Nashik, MH (19.9975° N, 73.7898° E)',
    growthStage: 'Early Flowering & Fruit Set (50 DAT)',
    soilType: 'Fertigated Red Loam with Drip Lines',
    weather: 'Bright Sunshine, 26°C, 39% RH, Wind: 7 km/h SW',
    previousTreatment: 'Silver-black plastic mulch with hand weeding in drip holes',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=400&q=80',
    description: 'Drip-irrigated tomato plants with Common Purslane succulent mats spreading along unmulched drip emitter junctions.',
    targetWeed: 'Common Purslane (Portulaca oleracea)',
    expectedCategory: 'Broadleaf Weeds',
    expectedSeverity: 'Low',
    presetBoxes: [
      {
        id: 'box-tm-1',
        weedClass: 'Broadleaf Weeds',
        speciesName: 'Common Purslane',
        confidence: 0.94,
        box: [48, 35, 78, 65]
      }
    ]
  }
];

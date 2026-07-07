/**
 * TinySteps AI Vector Illustration Generator
 * Generates beautiful, custom vector illustrations as SVG markup based on themes, animals, and colors.
 */

export function getStoryIllustration(animal: string, theme: string, color: string = '#6C63FF'): string {
  const primaryColor = color || '#6C63FF';
  const animalName = (animal || 'rabbit').toLowerCase();
  const themeName = (theme || 'adventure').toLowerCase();

  // Common SVG headers and footers
  const header = `<svg viewBox="0 0 800 500" class="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">`;
  const footer = `</svg>`;

  // Gradients and common definitions based on themes
  let background = '';
  let scenery = '';
  let animalSvg = '';

  // 1. BACKGROUNDS
  if (themeName.includes('space') || themeName.includes('star') || themeName.includes('galaxy')) {
    // Space Theme - Deep Purple & Dark Blue Night Sky with Stars
    background = `
      <defs>
        <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="60%" stopColor="#311042" />
          <stop offset="100%" stopColor="#4A0E4E" />
        </linearGradient>
        <radialGradient id="planetGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FF8F00" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="url(#spaceGrad)" />
      <!-- Stars -->
      <g fill="#FFFFFF" opacity="0.8">
        <circle cx="100" cy="80" r="1.5" />
        <circle cx="180" cy="150" r="1.2" />
        <circle cx="250" cy="70" r="2" />
        <circle cx="340" cy="120" r="1" />
        <circle cx="450" cy="80" r="1.8" />
        <circle cx="520" cy="160" r="1.2" />
        <circle cx="620" cy="60" r="2" />
        <circle cx="700" cy="130" r="1.5" />
        <circle cx="750" cy="220" r="1" />
        <circle cx="80" cy="240" r="1.3" />
        <!-- Glowing stars -->
        <path d="M 150 100 L 152 104 L 156 105 L 152 106 L 150 110 L 148 106 L 144 105 L 148 104 Z" fill="#FFE082" />
        <path d="M 650 150 L 651.5 153 L 655 154 L 651.5 155 L 650 158 L 648.5 155 L 645 154 L 648.5 153 Z" fill="#FFE082" />
      </g>
    `;
    scenery = `
      <!-- Planets -->
      <circle cx="680" cy="100" r="45" fill="url(#planetGrad)" />
      <path d="M 620 110 Q 680 140 740 100" stroke="#FFD54F" stroke-width="4" fill="none" opacity="0.6" />
      <circle cx="120" cy="180" r="20" fill="#90A4AE" opacity="0.4" />
      
      <!-- Lunar landscape ground -->
      <path d="M 0 420 Q 200 380 400 430 T 800 400 L 800 500 L 0 500 Z" fill="#2E2A5C" />
      <path d="M 0 450 Q 300 420 550 470 T 800 440 L 800 500 L 0 500 Z" fill="#1C1844" />
      
      <!-- Rocket -->
      <g transform="translate(480, 150) rotate(25) scale(0.7)">
        <path d="M 50 0 C 100 0 100 120 100 120 L 0 120 C 0 120 0 0 50 0 Z" fill="#ECEFF1" />
        <path d="M 50 0 C 75 0 85 50 85 100 L 15 100 C 15 50 25 0 50 0 Z" fill="#FF5252" />
        <!-- Window -->
        <circle cx="50" cy="50" r="18" fill="#37474F" />
        <circle cx="50" cy="50" r="14" fill="#81D4FA" />
        <!-- Fins -->
        <path d="M 0 100 L -25 130 L 0 130 Z" fill="#FF5252" />
        <path d="M 100 100 L 125 130 L 100 130 Z" fill="#FF5252" />
        <!-- Fire -->
        <path d="M 35 120 Q 50 160 65 120 Z" fill="#FFAB40" />
        <path d="M 42 120 Q 50 145 58 120 Z" fill="#FFD740" />
      </g>
    `;
  } else if (themeName.includes('forest') || themeName.includes('nature') || themeName.includes('jungle') || themeName.includes('garden')) {
    // Forest/Nature Theme - Deep Green & Warm Sun
    background = `
      <defs>
        <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" /> <!-- Sky blue -->
          <stop offset="60%" stopColor="#F0FDF4" /> <!-- Soft mint -->
          <stop offset="100%" stopColor="#DCFCE7" /> <!-- Pastel green -->
        </linearGradient>
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFbeb" />
          <stop offset="100%" stopColor="#FEF08A" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#forestGrad)" />
      <!-- Sun -->
      <circle cx="700" cy="100" r="60" fill="url(#sunGrad)" opacity="0.6" />
      <!-- Clouds -->
      <g fill="#FFFFFF" opacity="0.75">
        <path d="M 100 120 Q 120 100 140 120 Q 160 100 180 120 A 25 25 0 0 1 180 150 L 100 150 Z" />
        <path d="M 450 80 Q 475 55 500 80 Q 525 55 550 80 A 30 30 0 0 1 550 120 L 450 120 Z" />
      </g>
    `;
    scenery = `
      <!-- Background Hills & Trees -->
      <path d="M 0 350 Q 150 280 300 340 T 600 320 Q 700 310 800 350 L 800 500 L 0 500 Z" fill="#A7F3D0" opacity="0.7" />
      <path d="M 0 380 Q 250 310 500 390 T 800 370 L 800 500 L 0 500 Z" fill="#34D399" opacity="0.5" />
      
      <!-- Forest Trees -->
      <g fill="#059669" opacity="0.8">
        <!-- Tree 1 -->
        <polygon points="120,250 90,320 150,320" />
        <polygon points="120,200 100,260 140,260" />
        <rect x="115" y="320" width="10" height="40" fill="#78350F" />
        <!-- Tree 2 -->
        <polygon points="650,230 610,310 690,310" />
        <polygon points="650,170 625,240 675,240" />
        <rect x="645" y="310" width="10" height="50" fill="#78350F" />
      </g>
      
      <!-- Ground -->
      <path d="M 0 410 Q 200 370 450 420 T 800 390 L 800 500 L 0 500 Z" fill="#10B981" />
      <path d="M 0 440 Q 300 400 600 450 T 800 430 L 800 500 L 0 500 Z" fill="#047857" />
      
      <!-- Flowers -->
      <g transform="translate(180, 430)">
        <circle cx="0" cy="0" r="6" fill="#FBBF24" />
        <circle cx="-10" cy="0" r="5" fill="#F87171" />
        <circle cx="10" cy="0" r="5" fill="#F87171" />
        <circle cx="0" cy="-10" r="5" fill="#F87171" />
        <circle cx="0" cy="10" r="5" fill="#F87171" />
        <rect x="-1" y="10" width="2" height="20" fill="#065F46" />
      </g>
      <g transform="translate(600, 440)">
        <circle cx="0" cy="0" r="6" fill="#FBBF24" />
        <circle cx="-10" cy="0" r="5" fill="#60A5FA" />
        <circle cx="10" cy="0" r="5" fill="#60A5FA" />
        <circle cx="0" cy="-10" r="5" fill="#60A5FA" />
        <circle cx="0" cy="10" r="5" fill="#60A5FA" />
        <rect x="-1" y="10" width="2" height="20" fill="#065F46" />
      </g>
    `;
  } else if (themeName.includes('ocean') || themeName.includes('sea') || themeName.includes('underwater') || themeName.includes('water')) {
    // Ocean/Underwater Theme - Deep Cyan and Teal
    background = `
      <defs>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284C7" /> <!-- Sky Blue -->
          <stop offset="40%" stopColor="#0369A1" /> <!-- Ocean Blue -->
          <stop offset="100%" stopColor="#0F172A" /> <!-- Dark Abyss -->
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#oceanGrad)" />
      <!-- Bubbles -->
      <g fill="#FFFFFF" opacity="0.3">
        <circle cx="200" cy="350" r="8" />
        <circle cx="210" cy="310" r="5" />
        <circle cx="195" cy="270" r="12" />
        <circle cx="550" cy="280" r="6" />
        <circle cx="560" cy="230" r="10" />
        <circle cx="545" cy="180" r="4" />
      </g>
    `;
    scenery = `
      <!-- Corals & Kelp -->
      <g fill="#14B8A6" opacity="0.7">
        <path d="M 100 500 Q 80 430 110 380 Q 140 430 120 500 Z" />
        <path d="M 130 500 Q 150 400 120 340 Q 90 400 110 500 Z" />
        <path d="M 680 500 Q 710 420 670 350 Q 640 420 660 500 Z" />
      </g>
      <!-- Coral Reef Ground -->
      <path d="M 0 450 Q 200 430 400 460 T 800 440 L 800 500 L 0 500 Z" fill="#0F766E" />
      <path d="M 0 475 Q 300 460 550 480 T 800 470 L 800 500 L 0 500 Z" fill="#115E59" />
      
      <!-- Tiny fish swimming -->
      <g fill="#F59E0B">
        <path d="M 500 180 C 480 170 470 190 450 180 C 440 185 440 175 435 170 L 435 190 Z" />
        <path d="M 300 240 C 280 230 270 250 250 240 C 240 245 240 235 235 230 L 235 250 Z" />
      </g>
    `;
  } else {
    // Cozy Home/Default Theme - Pastel Peach & Purple sunset
    background = `
      <defs>
        <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2F6" />
          <stop offset="50%" stopColor="#FAE8FF" /> <!-- Warm pink-violet -->
          <stop offset="100%" stopColor="#E0E7FF" /> <!-- Soft blue -->
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#defaultGrad)" />
      <!-- Distant Hills -->
      <path d="M 0 380 Q 200 320 400 390 T 800 360 L 800 500 L 0 500 Z" fill="#DDD6FE" opacity="0.6" />
    `;
    scenery = `
      <!-- Hills & Castle Silhouette or Cozy Cottage -->
      <path d="M 0 410 Q 250 360 500 420 T 800 390 L 800 500 L 0 500 Z" fill="#C7D2FE" opacity="0.8" />
      <!-- Cottage -->
      <g transform="translate(580, 270)">
        <polygon points="50,0 0,40 100,40" fill="#F43F5E" />
        <rect x="10" y="40" width="80" height="80" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="2" />
        <rect x="35" y="70" width="30" height="50" fill="#78350F" />
        <circle cx="30" cy="55" r="10" fill="#FCD34D" />
      </g>
      <!-- Grass ground -->
      <path d="M 0 440 Q 300 410 600 450 T 800 430 L 800 500 L 0 500 Z" fill="#818CF8" />
    `;
  }

  // 2. ANIMALS
  if (animalName.includes('rabbit') || animalName.includes('bunny')) {
    // Rabbit - Long ears, white body, cute cheeks
    animalSvg = `
      <g transform="translate(320, 280)">
        <!-- Shadows -->
        <ellipse cx="80" cy="130" rx="70" ry="15" fill="#000000" opacity="0.15" />
        
        <!-- Ears -->
        <!-- Left Ear -->
        <g transform="translate(40, -10) rotate(-10)">
          <path d="M 0 0 C -15 -40 -15 -100 10 -100 C 35 -100 35 -40 20 0 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
          <path d="M 5 -10 C -5 -35 -5 -85 10 -85 C 25 -85 25 -35 15 -10 Z" fill="#FFC0CB" />
        </g>
        <!-- Right Ear -->
        <g transform="translate(100, -10) rotate(10)">
          <path d="M 0 0 C -15 -40 -15 -100 10 -100 C 35 -100 35 -40 20 0 Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
          <path d="M 5 -10 C -5 -35 -5 -85 10 -85 C 25 -85 25 -35 15 -10 Z" fill="#FFC0CB" />
        </g>
        
        <!-- Body -->
        <ellipse cx="80" cy="100" rx="55" ry="45" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
        <!-- Belly -->
        <ellipse cx="80" cy="110" rx="35" ry="25" fill="#F8FAFC" />
        
        <!-- Head -->
        <circle cx="80" cy="35" r="42" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
        
        <!-- Face Details -->
        <!-- Eyes -->
        <circle cx="65" cy="30" r="5" fill="#1E293B" />
        <circle cx="95" cy="30" r="5" fill="#1E293B" />
        <circle cx="63" cy="28" r="1.5" fill="#FFFFFF" />
        <circle cx="93" cy="28" r="1.5" fill="#FFFFFF" />
        
        <!-- Nose -->
        <polygon points="76,42 84,42 80,47" fill="#FF8A8A" />
        
        <!-- Whiskers -->
        <line x1="45" y1="45" x2="25" y2="42" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="45" y1="52" x2="25" y2="54" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="115" y1="45" x2="135" y2="42" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="115" y1="52" x2="135" y2="54" stroke="#94A3B8" stroke-width="1.5" />
        
        <!-- Pink Cheeks -->
        <circle cx="53" cy="40" r="6" fill="#FFC0CB" opacity="0.6" />
        <circle cx="107" cy="40" r="6" fill="#FFC0CB" opacity="0.6" />
        
        <!-- Smile -->
        <path d="M 76 52 Q 80 56 84 52" stroke="#1E293B" stroke-width="2" fill="none" />
        
        <!-- Arms/Paws -->
        <ellipse cx="30" cy="90" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
        <ellipse cx="130" cy="90" rx="14" ry="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
        
        <!-- Cute Accessories (Holding a small heart or star) -->
        <path d="M 80 75 L 82 81 L 88 81 L 83 85 L 85 91 L 80 87 L 75 91 L 77 85 L 72 81 L 78 81 Z" fill="#FFD740" />
      </g>
    `;
  } else if (animalName.includes('bear')) {
    // Bear - Round ears, warm brown body, friendly smile
    animalSvg = `
      <g transform="translate(320, 270)">
        <!-- Shadows -->
        <ellipse cx="80" cy="140" rx="75" ry="15" fill="#000000" opacity="0.15" />
        
        <!-- Ears -->
        <circle cx="35" cy="20" r="18" fill="#B45309" />
        <circle cx="35" cy="20" r="10" fill="#F59E0B" />
        <circle cx="125" cy="20" r="18" fill="#B45309" />
        <circle cx="125" cy="20" r="10" fill="#F59E0B" />
        
        <!-- Body -->
        <ellipse cx="80" cy="105" rx="60" ry="50" fill="#B45309" />
        <!-- Belly -->
        <ellipse cx="80" cy="115" rx="38" ry="30" fill="#F59E0B" opacity="0.8" />
        
        <!-- Head -->
        <circle cx="80" cy="45" r="46" fill="#D97706" />
        
        <!-- Muzzle -->
        <ellipse cx="80" cy="55" rx="18" ry="14" fill="#F59E0B" />
        
        <!-- Eyes -->
        <circle cx="62" cy="38" r="5" fill="#1E293B" />
        <circle cx="98" cy="38" r="5" fill="#1E293B" />
        <circle cx="60" cy="36" r="1.5" fill="#FFFFFF" />
        <circle cx="96" cy="36" r="1.5" fill="#FFFFFF" />
        
        <!-- Nose -->
        <path d="M 74 48 Q 80 44 86 48 Q 80 54 74 48 Z" fill="#1E293B" />
        <!-- Mouth -->
        <path d="M 80 54 L 80 60 Q 80 64 75 64 M 80 60 Q 80 64 85 64" stroke="#1E293B" stroke-width="2" fill="none" />
        
        <!-- Cheeks -->
        <circle cx="50" cy="46" r="5" fill="#F87171" opacity="0.4" />
        <circle cx="110" cy="46" r="5" fill="#F87171" opacity="0.4" />
        
        <!-- Paws -->
        <circle cx="25" cy="100" r="15" fill="#B45309" />
        <circle cx="135" cy="100" r="15" fill="#B45309" />
      </g>
    `;
  } else if (animalName.includes('fox')) {
    // Fox - Pointy ears, orange body, white chest and tail tip
    animalSvg = `
      <g transform="translate(320, 275)">
        <!-- Shadow -->
        <ellipse cx="80" cy="135" rx="70" ry="15" fill="#000000" opacity="0.15" />
        
        <!-- Pointy Ears -->
        <polygon points="30,30 20,-15 55,10" fill="#EA580C" />
        <polygon points="33,24 25,-5 50,8" fill="#FFEDD5" />
        <polygon points="130,30 140,-15 105,10" fill="#EA580C" />
        <polygon points="127,24 135,-5 110,8" fill="#FFEDD5" />
        
        <!-- Body -->
        <ellipse cx="80" cy="105" rx="55" ry="45" fill="#EA580C" />
        <path d="M 50 75 Q 80 110 110 75 Q 80 135 50 75" fill="#FFFFFF" />
        
        <!-- Head -->
        <ellipse cx="80" cy="45" r="42" fill="#F97316" />
        <path d="M 38 45 C 38 65 65 75 80 75 C 95 75 122 65 122 45 Z" fill="#EA580C" />
        
        <!-- White cheeks/muzzle panels -->
        <path d="M 38 45 Q 60 55 80 48 Q 100 55 122 45 C 115 65 95 72 80 72 C 65 72 45 65 38 45 Z" fill="#FFFFFF" />
        
        <!-- Nose -->
        <circle cx="80" cy="58" r="6" fill="#1E293B" />
        
        <!-- Eyes -->
        <circle cx="62" cy="38" r="4.5" fill="#1E293B" />
        <circle cx="98" cy="38" r="4.5" fill="#1E293B" />
        <circle cx="60" cy="36" r="1.5" fill="#FFFFFF" />
        <circle cx="96" cy="36" r="1.5" fill="#FFFFFF" />
        
        <!-- Smile -->
        <path d="M 76 65 Q 80 68 84 65" stroke="#1E293B" stroke-width="1.5" fill="none" />
        
        <!-- Tail -->
        <g transform="translate(115, 60) rotate(15)">
          <path d="M 0 40 C 20 10 50 0 60 40 C 50 80 20 70 0 40 Z" fill="#EA580C" />
          <path d="M 40 22 C 50 15 55 15 60 40 C 50 60 45 55 40 46 Z" fill="#FFFFFF" />
        </g>
      </g>
    `;
  } else if (animalName.includes('lion') || animalName.includes('cat')) {
    // Lion - Cute golden mane, happy kitty face
    animalSvg = `
      <g transform="translate(320, 270)">
        <!-- Shadow -->
        <ellipse cx="80" cy="140" rx="75" ry="15" fill="#000000" opacity="0.15" />
        
        <!-- Mane (Background circle of fluffy clouds) -->
        <g fill="#D97706">
          <circle cx="80" cy="45" r="56" />
          <circle cx="40" cy="20" r="24" />
          <circle cx="120" cy="20" r="24" />
          <circle cx="30" cy="60" r="24" />
          <circle cx="130" cy="60" r="24" />
          <circle cx="50" cy="100" r="24" />
          <circle cx="110" cy="100" r="24" />
          <circle cx="80" cy="105" r="24" />
        </g>
        
        <!-- Ears -->
        <circle cx="45" cy="15" r="14" fill="#F59E0B" />
        <circle cx="115" cy="15" r="14" fill="#F59E0B" />
        
        <!-- Body -->
        <ellipse cx="80" cy="110" rx="55" ry="42" fill="#F59E0B" />
        <ellipse cx="80" cy="120" rx="30" ry="22" fill="#FEF3C7" />
        
        <!-- Head -->
        <circle cx="80" cy="50" r="42" fill="#FBBF24" />
        
        <!-- Muzzle -->
        <ellipse cx="80" cy="62" rx="14" ry="10" fill="#FEF3C7" />
        
        <!-- Eyes -->
        <circle cx="64" cy="42" r="4.5" fill="#1E293B" />
        <circle cx="96" cy="42" r="4.5" fill="#1E293B" />
        <circle cx="62" cy="40" r="1.5" fill="#FFFFFF" />
        <circle cx="94" cy="40" r="1.5" fill="#FFFFFF" />
        
        <!-- Nose -->
        <polygon points="76,55 84,55 80,60" fill="#F87171" />
        <!-- Smile -->
        <path d="M 80 60 L 80 64 Q 80 68 76 68 M 80 64 Q 80 68 84 68" stroke="#1E293B" stroke-width="1.5" fill="none" />
      </g>
    `;
  } else {
    // Adorable Little Dinosaur / Friendly Dragon (Default Kid Favorite!)
    animalSvg = `
      <g transform="translate(320, 270)">
        <!-- Shadow -->
        <ellipse cx="80" cy="140" rx="75" ry="15" fill="#000000" opacity="0.15" />
        
        <!-- Back Spikes -->
        <g fill="#4ADE80">
          <polygon points="25,50 10,65 30,80" />
          <polygon points="15,85 0,100 20,115" />
        </g>
        
        <!-- Tail -->
        <path d="M 35 115 Q 10 130 0 100 Q 15 90 35 115" fill="#10B981" />
        
        <!-- Body -->
        <ellipse cx="80" cy="105" rx="52" ry="45" fill="#10B981" />
        <!-- Belly -->
        <ellipse cx="85" cy="110" rx="30" ry="25" fill="#A7F3D0" />
        
        <!-- Head & Neck -->
        <path d="M 70 100 L 70 50 Q 70 30 90 30 Q 115 30 115 50 Q 115 65 95 65 L 90 100 Z" fill="#10B981" />
        
        <!-- Eyes -->
        <circle cx="102" cy="42" r="5" fill="#1E293B" />
        <circle cx="100" cy="40" r="1.5" fill="#FFFFFF" />
        
        <!-- Cheeks -->
        <circle cx="92" cy="48" r="4" fill="#F87171" opacity="0.6" />
        
        <!-- Cute Horns/Spikes on Head -->
        <polygon points="85,30 80,18 93,28" fill="#FBBF24" />
        <polygon points="100,30 100,15 108,28" fill="#FBBF24" />
        
        <!-- Tiny hands -->
        <ellipse cx="120" cy="95" rx="10" ry="7" fill="#10B981" />
        <!-- Smile -->
        <path d="M 104 52 Q 108 55 112 51" stroke="#1E293B" stroke-width="2" fill="none" />
      </g>
    `;
  }

  // Combine components with nice SVG attributes
  return `${header}
    ${background}
    ${scenery}
    ${animalSvg}
  ${footer}`;
}

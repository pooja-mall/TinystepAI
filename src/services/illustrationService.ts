/**
 * Illustration Service
 * Generates custom, premium inline SVGs for every page of the storybook based on the theme and page sequence.
 * Fully offline, lightweight, and highly polished with beautiful gradients and vector scenery.
 */

export const illustrationService = {
  /**
   * Generates a theme-specific, responsive SVG based on page state.
   */
  getSceneIllustration(theme: string, pageNumber: number, childName: string, animal: string): string {
    const normTheme = theme.toLowerCase();
    const primaryColor = '#6C63FF'; // Brand indigo
    const secondaryColor = '#FFA726'; // Coral/Orange

    // Twinkling stars helper
    const getStars = (count: number) => {
      let starsSvg = '';
      for (let i = 0; i < count; i++) {
        const x = Math.sin(i * 99) * 350 + 400;
        const y = Math.cos(i * 45) * 180 + 200;
        const r = (i % 3 === 0) ? 2 : 1;
        const opacity = 0.3 + (i % 5) * 0.15;
        starsSvg += `<circle cx="${x}" cy="${y}" r="${r}" fill="#FFFFFF" opacity="${opacity}" class="animate-pulse" style="animation-delay: ${i * 0.3}s" />`;
      }
      return starsSvg;
    };

    // Space/Cosmic Theme
    if (normTheme.includes('space') || normTheme.includes('star') || normTheme.includes('superhero')) {
      const moonRadius = pageNumber === 5 ? 50 : 35;
      const rocketY = 220 - (pageNumber * 25);
      return `
        <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="spaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B0D1B" />
              <stop offset="50%" stopColor="#171A30" />
              <stop offset="100%" stopColor="#251F3D" />
            </linearGradient>
            <linearGradient id="planetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF7043" />
              <stop offset="100%" stopColor="#D84315" />
            </linearGradient>
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFF9C4" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          <!-- Background -->
          <rect width="800" height="450" fill="url(#spaceGrad)" />
          
          <!-- Twinkling Stars -->
          ${getStars(40)}

          <!-- Deep Space Nebula -->
          <circle cx="200" cy="150" r="120" fill="#BA68C8" opacity="0.12" filter="blur(30px)" />
          <circle cx="650" cy="280" r="140" fill="#26C6DA" opacity="0.1" filter="blur(40px)" />

          <!-- Floating Planets -->
          <g transform="translate(120, 100)" opacity="0.8">
            <circle cx="0" cy="0" r="24" fill="url(#planetGrad)" />
            <!-- Planet Ring -->
            <ellipse cx="0" cy="0" rx="36" ry="6" fill="none" stroke="#FFAB91" strokeWidth="3" transform="rotate(-15)" />
          </g>

          <g transform="translate(680, 120)">
            <circle cx="0" cy="0" r="18" fill="#4DD0E1" />
            <circle cx="-5" cy="-5" r="4" fill="#E0F7FA" opacity="0.6" />
          </g>

          <!-- Animated Crescent Moon or Giant Sleeping Moon -->
          <g transform="translate(400, 150)">
            <circle cx="0" cy="0" r="${moonRadius + 15}" fill="url(#moonGlow)" />
            <path d="M-10,-${moonRadius} A${moonRadius},${moonRadius} 0 1,0 ${moonRadius},10 A${moonRadius - 8},${moonRadius - 8} 0 1,1 -10,-${moonRadius}" fill="#FFF59D" />
            <!-- Sleeping face on Page 5 -->
            ${pageNumber === 5 ? `
              <path d="M10,-10 Q14,-6 18,-10" stroke="#795548" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M22,2 Q24,6 26,2" stroke="#795548" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M14,12 Q18,16 22,12" stroke="#FF8A80" strokeWidth="3" fill="none" strokeLinecap="round" />
            ` : ''}
          </g>

          <!-- Rocket or Flying Animal/Child (pacing changes with pageNumber) -->
          <g transform="translate(${250 + (pageNumber * 50)}, ${rocketY}) rotate(${-10 + pageNumber * 4})">
            <!-- Rocket Body -->
            <path d="M-10,-35 C-10,-55 0,-70 10,-70 C20,-70 30,-55 30,-35 L30,10 L-10,10 Z" fill="#ECEFF1" />
            <path d="M10,-70 C15,-70 30,-55 30,-35 L30,10 L10,10 Z" fill="#CFD8DC" />
            <!-- Red Nose Cone -->
            <path d="M-10,-35 C-10,-55 0,-70 10,-70 C20,-70 20,-55 20,-35 Z" fill="#FF5252" transform="translate(0, 0)" />
            <!-- Fins -->
            <path d="M-10,0 L-25,15 L-10,15 Z" fill="#FF5252" />
            <path d="M30,0 L45,15 L30,15 Z" fill="#FF5252" />
            <!-- Round Window -->
            <circle cx="10" cy="-20" r="10" fill="#80DEEA" stroke="#B0BEC5" strokeWidth="2" />
            <!-- Little Child Face inside Window -->
            <circle cx="10" cy="-20" r="6" fill="#FFE082" />
            <circle cx="8" cy="-21" r="1" fill="#37474F" />
            <circle cx="12" cy="-21" r="1" fill="#37474F" />
            <path d="M9,-18 Q10,-17 11,-18" stroke="#37474F" strokeWidth="1" fill="none" />
            
            <!-- Fire Flame / Stardust Engine trail -->
            <path d="M-2,15 L10,35 L22,15 Z" fill="#FF9100" />
            <path d="M3,15 L10,28 L17,15 Z" fill="#FFD600" />
          </g>

          <!-- Cute Floating Astronaut Animal (the designated helper animal) -->
          <g transform="translate(${480 - (pageNumber * 10)}, ${230 + Math.sin(pageNumber) * 20})">
            <!-- Glass Helmet -->
            <circle cx="0" cy="0" r="30" fill="#E0F7FA" opacity="0.3" stroke="#80DEEA" strokeWidth="1.5" />
            <!-- Cute Animal Face (represented simply and neatly) -->
            <circle cx="0" cy="2" r="18" fill="#FFB74D" /> <!-- Teddy/Fox orange-brown -->
            <circle cx="-12" cy="-14" r="7" fill="#FFB74D" /> <!-- Left Ear -->
            <circle cx="12" cy="-14" r="7" fill="#FFB74D" /> <!-- Right Ear -->
            <circle cx="-12" cy="-14" r="3" fill="#FFE0B2" /> <!-- Left Inner Ear -->
            <circle cx="12" cy="-14" r="3" fill="#FFE0B2" /> <!-- Right Inner Ear -->
            <!-- Eyes -->
            <circle cx="-5" cy="-1" r="2" fill="#3E2723" />
            <circle cx="5" cy="-1" r="2" fill="#3E2723" />
            <!-- Snout -->
            <ellipse cx="0" cy="5" rx="5" ry="3" fill="#FFE0B2" />
            <polygon points="-2,4 2,4 0,6" fill="#3E2723" />
            <!-- Space Suit Body -->
            <rect x="-15" y="20" width="30" height="25" rx="8" fill="#FFFFFF" />
            <rect x="-8" y="25" width="16" height="14" rx="2" fill="#E0F2FE" />
            <circle cx="0" cy="32" r="2" fill="#FF1744" />
          </g>

          <!-- Floating decorative space items -->
          <g transform="translate(150, 340)" class="animate-bounce" style="animation-duration: 4s">
            <polygon points="10,0 13,7 20,7 15,11 17,18 10,14 3,18 5,11 0,7 7,7" fill="#FFF176" opacity="0.6" />
          </g>

          <!-- Floor Grass / Ground of child's window perspective -->
          <path d="M-10,410 Q400,380 810,410 L810,460 L-10,460 Z" fill="#1C1E36" />
          <path d="M-10,425 Q400,405 810,425 L810,460 L-10,460 Z" fill="#141525" />
        </svg>
      `;
    }

    // Ocean / Under the Sea Theme
    if (normTheme.includes('ocean') || normTheme.includes('sea') || normTheme.includes('princess')) {
      const coralHue = pageNumber % 2 === 0 ? '#FF8A80' : '#FFD54F';
      return `
        <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#006064" />
              <stop offset="55%" stopColor="#00838F" />
              <stop offset="100%" stopColor="#004D40" />
            </linearGradient>
            <linearGradient id="shellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A80" />
              <stop offset="100%" stopColor="#FF5252" />
            </linearGradient>
          </defs>

          <!-- Ocean Background -->
          <rect width="800" height="450" fill="url(#oceanGrad)" />

          <!-- Sunbeams filtering through water -->
          <polygon points="100,-10 300,-10 150,460 0,460" fill="#E0F7FA" opacity="0.08" />
          <polygon points="350,-10 500,-10 450,460 250,460" fill="#E0F7FA" opacity="0.06" />
          <polygon points="600,-10 750,-10 800,460 650,460" fill="#E0F7FA" opacity="0.07" />

          <!-- Rising Bubbles -->
          <circle cx="250" cy="${350 - pageNumber * 40}" r="8" fill="none" stroke="#E0F7FA" strokeWidth="1.5" opacity="0.5" />
          <circle cx="255" cy="${330 - pageNumber * 40}" r="4" fill="none" stroke="#E0F7FA" strokeWidth="1" opacity="0.4" />
          <circle cx="580" cy="${410 - pageNumber * 45}" r="12" fill="none" stroke="#E0F7FA" strokeWidth="1.5" opacity="0.6" />
          <circle cx="590" cy="${380 - pageNumber * 45}" r="6" fill="none" stroke="#E0F7FA" strokeWidth="1.2" opacity="0.5" />
          <circle cx="110" cy="${210 - pageNumber * 15}" r="5" fill="none" stroke="#E0F7FA" strokeWidth="1" opacity="0.3" />

          <!-- Sea Coral Bed -->
          <g transform="translate(80, 450)">
            <path d="M0,0 L15,-80 Q25,-90 30,-70 L20,0" fill="${coralHue}" opacity="0.9" />
            <path d="M15,-40 L35,-65 Q42,-70 45,-55 L25,0" fill="${coralHue}" opacity="0.8" />
            <path d="M-15,0 L-5,-60 Q3,-70 5,-50 L-5,0" fill="#4DB6AC" opacity="0.8" />
          </g>

          <g transform="translate(700, 450)">
            <path d="M0,0 L-20,-90 Q-30,-100 -35,-80 L-10,0" fill="#4DD0E1" opacity="0.9" />
            <path d="M-10,-45 L-30,-75 Q-35,-80 -38,-65 L-15,0" fill="#FFD54F" opacity="0.85" />
            <path d="M15,0 L5,-50 Q0,-60 -5,-45 L5,0" fill="#81C784" opacity="0.8" />
          </g>

          <!-- Cute Sea Turtle or Helper Animal (swimming across screen) -->
          <g transform="translate(${150 + pageNumber * 65}, ${220 + Math.sin(pageNumber) * 30})">
            <!-- Turtle Shell -->
            <ellipse cx="0" cy="0" rx="42" ry="32" fill="#4CAF50" />
            <ellipse cx="0" cy="0" rx="35" ry="26" fill="#81C784" stroke="#388E3C" strokeWidth="1.5" />
            <!-- Flippers -->
            <path d="M-20,-25 C-35,-45 -55,-40 -50,-20 C-45,-10 -30,-10 -20,-15" fill="#388E3C" />
            <path d="M20,-25 C35,-45 55,-40 50,-20 C45,-10 30,-10 20,-15" fill="#388E3C" />
            <path d="M-25,20 C-35,35 -45,35 -40,20 C-35,15 -30,15 -25,20" fill="#388E3C" />
            <path d="M25,20 C35,35 45,35 40,20 C35,15 30,15 25,20" fill="#388E3C" />
            <!-- Head -->
            <g transform="translate(0, -42)">
              <circle cx="0" cy="0" r="15" fill="#81C784" />
              <!-- Eyes -->
              <circle cx="-5" cy="-3" r="2.5" fill="#1B5E20" />
              <circle cx="5" cy="-3" r="2.5" fill="#1B5E20" />
              <circle cx="-4" cy="-4" r="1" fill="#FFFFFF" />
              <circle cx="6" cy="-4" r="1" fill="#FFFFFF" />
              <!-- Cozy smile -->
              <path d="M-4,4 Q0,8 4,4" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
            <!-- Tiny Sleeping Cap on Turtle -->
            <path d="M-8,-55 L8,-55 L12,-48 L-12,-48 Z" fill="#FFF59D" />
            <circle cx="12" cy="-48" r="4" fill="#FFFFFF" />
          </g>

          <!-- Little Glowing Jellyfish -->
          <g transform="translate(${620 - pageNumber * 25}, ${130 + Math.cos(pageNumber) * 20})">
            <path d="M-15,0 C-15,-20 15,-20 15,0 Z" fill="#E1BEE7" opacity="0.8" />
            <circle cx="0" cy="-5" r="15" fill="#F3E5F5" opacity="0.4" />
            <!-- Tentacles -->
            <path d="M-10,0 Q-15,15 -10,30" stroke="#BA68C8" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M0,0 Q5,18 0,35" stroke="#BA68C8" strokeWidth="2" fill="none" opacity="0.7" />
            <path d="M10,0 Q5,15 10,30" stroke="#BA68C8" strokeWidth="2" fill="none" opacity="0.7" />
          </g>

          <!-- Sandy Seabed Bottom -->
          <path d="M-10,420 Q400,390 810,420 L810,460 L-10,460 Z" fill="#FFCC80" />
          <path d="M-10,432 Q400,410 810,432 L810,460 L-10,460 Z" fill="#FFE0B2" opacity="0.9" />

          <!-- Tiny Sleeping Starfish on Seabed -->
          <g transform="translate(380, 425)" opacity="0.9">
            <polygon points="10,0 13,7 20,7 15,11 17,18 10,14 3,18 5,11 0,7 7,7" fill="#FF8A80" />
            <circle cx="8" cy="8" r="1" fill="#37474F" />
            <circle cx="12" cy="8" r="1" fill="#37474F" />
          </g>
        </svg>
      `;
    }

    // Forest / Animals / Magic / Jungle / Dinosaurs / Default Theme
    const grassColor = pageNumber === 5 ? '#1B3020' : '#4CAF50';
    const skyGrad1 = pageNumber === 5 ? '#0D1117' : '#E8F5E9';
    const skyGrad2 = pageNumber === 5 ? '#161B22' : '#C8E6C9';
    return `
      <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="${skyGrad1}" />
            <stop offset="100%" stopColor="${skyGrad2}" />
          </linearGradient>
          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF59D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FFF59D" stopOpacity="0" />
          </radialGradient>
        </defs>

        <!-- Sky Background -->
        <rect width="800" height="450" fill="url(#forestSky)" />

        <!-- Distant Mountains/Hills -->
        <path d="M-10,340 Q150,230 350,300 T810,250 L810,460 L-10,460 Z" fill="#C8E6C9" opacity="0.5" />
        <path d="M200,320 Q450,260 650,310 T810,340 L810,460 L200,460 Z" fill="#A5D6A7" opacity="0.6" />

        <!-- Twinkling stars if bedtime/page 5 -->
        ${pageNumber === 5 ? getStars(35) : ''}

        <!-- Big Cozy Tree (Grows larger or shifts based on sequence) -->
        <g transform="translate(680, 260)">
          <!-- Trunk -->
          <rect x="-15" y="0" width="30" height="150" fill="#795548" />
          <!-- Foliage -->
          <circle cx="0" cy="-30" r="60" fill="url(#treeGrad)" />
          <circle cx="-35" cy="-55" r="45" fill="#4CAF50" opacity="0.9" />
          <circle cx="35" cy="-55" r="45" fill="#4CAF50" opacity="0.9" />
          
          <!-- Cute sleeping owl in tree (Page 5 bonus) -->
          ${pageNumber === 5 ? `
            <g transform="translate(0, -25)">
              <rect x="-10" y="-10" width="20" height="20" rx="6" fill="#90A4AE" />
              <circle cx="-5" cy="-2" r="4" fill="#FFFFFF" />
              <circle cx="5" cy="-2" r="4" fill="#FFFFFF" />
              <!-- Closed sleeping eyes -->
              <path d="M-7,-2 Q-5,0 -3,-2" stroke="#37474F" strokeWidth="1.5" fill="none" />
              <path d="M3,-2 Q5,0 7,-2" stroke="#37474F" strokeWidth="1.5" fill="none" />
              <!-- Orange beak -->
              <polygon points="-2,1 2,1 0,4" fill="#FF9800" />
            </g>
          ` : ''}
        </g>

        <!-- Another tree on left -->
        <g transform="translate(100, 280)">
          <rect x="-10" y="0" width="20" height="130" fill="#795548" />
          <circle cx="0" cy="-20" r="50" fill="url(#treeGrad)" />
          <circle cx="-25" cy="-40" r="35" fill="#4CAF50" opacity="0.9" />
        </g>

        <!-- Glowing Fireflies (Active and pulsing) -->
        <g opacity="0.8">
          <circle cx="180" cy="220" r="15" fill="url(#lampGlow)" />
          <circle cx="180" cy="220" r="3" fill="#FFEE58" />
          
          <circle cx="530" cy="180" r="20" fill="url(#lampGlow)" />
          <circle cx="530" cy="180" r="4" fill="#FFEE58" />

          <circle cx="340" cy="140" r="12" fill="url(#lampGlow)" />
          <circle cx="340" cy="140" r="2.5" fill="#FFEE58" />
        </g>

        <!-- Cute Little Teddy/Dinosaur Baby Animal sleeping on a pile of leaves -->
        <g transform="translate(${350 + pageNumber * 10}, ${280 + Math.sin(pageNumber) * 5})">
          <!-- Body of animal -->
          <ellipse cx="40" cy="45" rx="32" ry="24" fill="#8D6E63" /> <!-- Brown animal body -->
          <circle cx="15" cy="30" r="18" fill="#8D6E63" /> <!-- Head -->
          <circle cx="8" cy="16" r="6" fill="#8D6E63" /> <!-- Left Ear -->
          <circle cx="22" cy="16" r="6" fill="#8D6E63" /> <!-- Right Ear -->
          <ellipse cx="15" cy="33" rx="7" ry="5" fill="#D7CCC8" /> <!-- Muzzle -->
          <!-- Sleeping eyes -->
          <path d="M8,26 Q11,28 13,26" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M17,26 Q19,28 21,26" stroke="#3E2723" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="15" cy="31" r="1.5" fill="#3E2723" /> <!-- Tiny Nose -->
          
          <!-- Sleeping blanket or Leaf on top -->
          <path d="M22,35 Q40,15 65,30 Q75,45 65,55 Q40,65 22,50 Z" fill="#81C784" stroke="#4CAF50" strokeWidth="1.5" />
          <path d="M22,35 Q45,35 65,30" stroke="#388E3C" strokeWidth="1" fill="none" />
          
          <!-- Floating 'Zzz' -->
          <g transform="translate(15, -10)" opacity="0.8" class="animate-bounce" style="animation-duration: 3s">
            <text x="0" y="0" fontFamily="monospace" fontSize="14" fontWeight="bold" fill="#78909C">Z</text>
            <text x="10" y="-8" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#90A4AE">z</text>
            <text x="18" y="-14" fontFamily="monospace" fontSize="8" fontWeight="bold" fill="#B0BEC5">z</text>
          </g>
        </g>

        <!-- Floor Green Grass -->
        <path d="M-10,380 Q400,340 810,380 L810,460 L-10,460 Z" fill="${grassColor}" />
        <path d="M-10,395 Q400,365 810,395 L810,460 L-10,460 Z" fill="#388E3C" opacity="0.95" />

        <!-- Tiny Wildflower or Mushroom on Floor -->
        <g transform="translate(230, 395)">
          <rect x="-2" y="0" width="4" height="15" fill="#81C784" />
          <circle cx="0" cy="-4" r="5" fill="#E57373" />
          <circle cx="-5" cy="-2" r="3" fill="#E57373" />
          <circle cx="5" cy="-2" r="3" fill="#E57373" />
          <circle cx="0" cy="0" r="3" fill="#FFF176" />
        </g>
      </svg>
    `;
  }
};

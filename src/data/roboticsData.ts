export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Prototype' | 'Completed' | 'Archived';

export interface RoboticsProject {
  id: string;
  slug: string;
  title: string;
  difficulty: ProjectDifficulty;
  category: string;
  status: ProjectStatus;
  period: string;
  shortDescription: string;
  fullDescription: string;
  thumbnail: string;
  gallery: { url: string; caption: string }[];
  hardware: string[];
  software: string[];
  features: string[];
  architecture: {
    hardwareArchitecture: string;
    softwareArchitecture: string;
    circuitNotes: string;
  };
  developmentStages: {
    stage: string;
    status: 'Completed' | 'In Progress' | 'Planned';
    description: string;
  }[];
  challenges: { challenge: string; solution: string }[];
  githubUrl?: string;
  demoUrl?: string;
  documentationUrl?: string;
}

export const ROBOTICS_PAGE_HERO = {
  title: 'IoT & Robotics',
  subtitle: 'From embedded systems to intelligent machines — exploring the intersection of hardware, software, and automation.',
  description:
    'Dedicated engineering workspace documenting applied hardware development, microcontroller programming, sensor integration, and experimental robotic builds. Each project reflects iterative prototyping, circuit design, and embedded firmware implementation.',
  statusBanner: 'New engineering projects and experimental builds are being documented.',
};

export const ROBOTICS_PROJECTS: RoboticsProject[] = [
  {
    id: 'esp32-environmental-monitor',
    slug: 'esp32-environmental-monitor',
    title: 'ESP32 Real-Time Environmental & Telemetry Node',
    difficulty: 'Intermediate',
    category: 'Embedded IoT & Telemetry',
    status: 'Prototype',
    period: '2025 – Present',
    shortDescription:
      'Low-power WiFi-enabled sensor station gathering ambient temperature, humidity, and atmospheric metrics with MQTT data streaming.',
    fullDescription:
      'An embedded IoT telemetry node engineered around the ESP32 dual-core microcontroller. Designed to capture local environmental conditions using digital I2C/analog sensors, package sensor payloads, and publish telemetry bursts over secure MQTT to a local dashboard gateway.',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        caption: 'ESP32 Development Board and sensor circuit prototyping on breadboard',
      },
      {
        url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        caption: 'Signal debugging, pinout mapping, and power regulation testing',
      },
    ],
    hardware: [
      'ESP32 DevKit V1 (Xtensa Dual-Core 240MHz)',
      'DHT22 / BMP280 Environmental Sensors (I2C/OneWire)',
      'Analog Light Sensor (LDR with 10k Voltage Divider)',
      '3.7V 18650 Li-Ion Cell with TP4056 Charging Module',
      '0.96-inch I2C Monochrome OLED Display',
    ],
    software: [
      'C++ (Arduino Core / ESP-IDF Framework)',
      'PubSubClient (MQTT Protocol)',
      'FreeRTOS (Dual-task architecture for sensor polling & WiFi transmission)',
      'ArduinoJson 7 for structured telemetry serialization',
    ],
    features: [
      'Dual-task FreeRTOS concurrency: Core 0 dedicated to WiFi/MQTT, Core 1 handling sensor reads',
      'Dynamic deep-sleep power management cycles extending standalone battery operation',
      'Local OLED real-time readout with automated screen sleep to conserve current',
      'Fault-tolerant auto-reconnect logic for intermittent WiFi environments',
    ],
    architecture: {
      hardwareArchitecture:
        'Powered via a 3.7V Li-Ion battery stepped down through an ultra-low dropout 3.3V linear regulator. Sensors interface over standard 3.3V I2C bus (SDA: GPIO 21, SCL: GPIO 22).',
      softwareArchitecture:
        'Firmware structured into non-blocking state machines. Sensor data sampling is decoupled from network transmit loops to prevent watchdog resets on network drops.',
      circuitNotes:
        'Includes decoupling capacitors (100nF ceramic + 10µF electrolytic) across the 3.3V rail to suppress RF transmission brownout spikes.',
    },
    developmentStages: [
      {
        stage: 'Phase 1: Breadboard Prototyping & Sensor Calibration',
        status: 'Completed',
        description: 'Verified I2C sensor addresses and calibrated analog reference voltages.',
      },
      {
        stage: 'Phase 2: Firmware Architecture & FreeRTOS Dual-Tasking',
        status: 'Completed',
        description: 'Separated sampling loop from network stack to prevent blocking.',
      },
      {
        stage: 'Phase 3: Deep Sleep Optimization & Custom PCB Layout',
        status: 'In Progress',
        description: 'Profiling current draw with digital multimeter and designing compact KiCad schematic.',
      },
    ],
    challenges: [
      {
        challenge: 'WiFi transmission current bursts causing sudden ESP32 brownout resets.',
        solution: 'Added low-ESR bulk capacitors on the power rails and optimized RF transmit power.',
      },
      {
        challenge: 'Sensor read delays blocking MQTT keep-alive packets.',
        solution: 'Implemented FreeRTOS tasks with separate priority queues for sensor polling and network sockets.',
      },
    ],
    githubUrl: 'https://github.com/atikrh-beep',
  },
  {
    id: 'arduino-obstacle-avoiding-robot',
    slug: 'arduino-obstacle-avoiding-robot',
    title: 'Autonomous Ultrasonic Obstacle-Avoiding Rover',
    difficulty: 'Beginner',
    category: 'Mobile Robotics & Actuation',
    status: 'Completed',
    period: '2024',
    shortDescription:
      'Differential drive rover utilizing HC-SR04 ultrasonic scanning and micro-servo positioning for autonomous collision avoidance.',
    fullDescription:
      'A foundational wheeled robotic chassis created to master microcontroller PWM motor control, ultrasonic echo timing, and state-based navigation algorithms. The system continuously evaluates forward distance, sweeps the sensor left and right with a micro-servo when obstacles appear, and computes the clearest travel corridor.',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
        caption: 'Assembled differential drive chassis with ultrasonic sensor turret',
      },
      {
        url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80',
        caption: 'H-bridge motor driver wiring and dual DC gear motor harness',
      },
    ],
    hardware: [
      'Arduino Uno R3 (ATmega328P)',
      'L298N Dual H-Bridge Motor Driver',
      'HC-SR04 Ultrasonic Distance Sensor',
      'SG90 9g Micro Servo Motor',
      '2x TT DC Geared Motors with Rubber Wheels + Caster Wheel',
      '2x 18650 Battery Pack with Power Switch',
    ],
    software: [
      'C++ (Arduino IDE)',
      'NewPing Distance Library',
      'Custom PWM Motor Speed Controller',
      'Finite State Machine Navigation',
    ],
    features: [
      'Real-time sonar distance ranging with ultrasonic pulse measurement',
      '180-degree servo sweep to assess left vs. right path viability upon obstacle detection',
      'Gradual PWM speed ramps preventing sudden motor stall currents and chassis tipping',
      'Independent motor speed calibration compensating for mechanical gearbox discrepancies',
    ],
    architecture: {
      hardwareArchitecture:
        'Arduino Uno powered via regulated 5V output of L298N board. Motors powered directly from dual 18650 battery pack (7.4V nominal) to prevent microcontroller voltage drops.',
      softwareArchitecture:
        'Continuous loop evaluating obstacle threshold. When distance < 25cm, robot halts, pans servo to 45° and 135°, determines the direction with greatest clearance, and executes a pivot turn.',
      circuitNotes:
        'Flyback diode protection built into L298N module. Common ground tied between Arduino logic and battery negative rail.',
    },
    developmentStages: [
      {
        stage: 'Phase 1: Motor Driver PWM Characterization',
        status: 'Completed',
        description: 'Tuned PWM duty cycles to establish linear speed response across both wheels.',
      },
      {
        stage: 'Phase 2: Sensor Turret Integration',
        status: 'Completed',
        description: 'Mounted HC-SR04 onto SG90 servo horn and wrote non-blocking timing routines.',
      },
      {
        stage: 'Phase 3: Navigation Logic & Edge-Case Handling',
        status: 'Completed',
        description: 'Refined corner-escape sequences to avoid deadlock in narrow alcoves.',
      },
    ],
    challenges: [
      {
        challenge: 'High motor inrush current resetting the Arduino during fast direction changes.',
        solution: 'Isolated motor power rail from Arduino logic and added power-rail filtering capacitors.',
      },
      {
        challenge: 'Specular reflection on soft or angled surfaces causing missed ultrasonic readings.',
        solution: 'Implemented running-median filter over 3 successive readings to discard spurious echoes.',
      },
    ],
    githubUrl: 'https://github.com/atikrh-beep',
  },
  {
    id: 'quadruped-spider-robot',
    slug: 'quadruped-spider-robot',
    title: '8-DOF Quadruped Walking Robot Platform',
    difficulty: 'Advanced',
    category: 'Biomimetic Robotics & Kinematics',
    status: 'In Progress',
    period: '2025 – Present',
    shortDescription:
      'Multi-servo quadruped walking platform investigating inverse kinematics, creeping gait generation, and coordinated servo bus power distribution.',
    fullDescription:
      'An advanced robotics initiative exploring multi-legged locomotion and mechanical gait generation. Incorporates eight high-torque micro servos across four articulated legs (two degrees of freedom per limb: coxa and femur/tibia links). Focuses on geometric coordinate calculations, center-of-gravity stabilization, and synchronized gait cycles.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        caption: 'Conceptual articulated leg geometry and kinematic linkage models',
      },
      {
        url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=80',
        caption: 'Servo bus controller and multi-channel high-current power harness',
      },
    ],
    hardware: [
      'ESP32 or Arduino Mega 2560 Core Controller',
      'PCA9685 16-Channel 12-bit PWM I2C Servo Driver',
      '8x TowerPro MG90S Metal Gear Micro Servos',
      'Custom 3D-Printed / Acrylic Spider Chassis',
      'High-Current 5V 5A UBEC (Universal Battery Elimination Circuit)',
      '2S 7.4V LiPo Battery',
    ],
    software: [
      'C++ (Inverse Kinematics Algorithm)',
      'Adafruit PWM Servo Driver Library',
      'Trigonometric Gait Phase Engine',
      'UART Telemetry Serial Bridge',
    ],
    features: [
      '8-DOF articulated leg motion utilizing dedicated 12-bit hardware PWM generator',
      'Creeping crawl and diagonal trot gait implementations maintaining center-of-mass balance',
      'Trigonometric inverse kinematics computing servo angle offsets from desired foot coordinates (X, Y, Z)',
      'Dedicated high-current servo power bus preventing microcontroller rail droop',
    ],
    architecture: {
      hardwareArchitecture:
        'Microcontroller communicates with PCA9685 PWM generator via standard I2C. The PCA9685 drives 8 independent metal-gear servos powered through a 5V/5A switching UBEC from a 2S LiPo battery.',
      softwareArchitecture:
        'Software breaks gait cycles into phase steps: leg lift, swing phase, stance phase, and body push. Inverse kinematics routines translate cartesian coordinates into respective joint angles.',
      circuitNotes:
        'Critical separation of high-current motor ground and sensitive logic ground to eliminate servo PWM switching noise.',
    },
    developmentStages: [
      {
        stage: 'Phase 1: Kinematic Modeling & Simulation',
        status: 'Completed',
        description: 'Calculated 2D planar inverse kinematics formulas for 2-segment limbs.',
      },
      {
        stage: 'Phase 2: Chassis Prototyping & Servo Integration',
        status: 'In Progress',
        description: 'Testing mechanical rigidity and assembling 8 MG90S servos with PCA9685 driver.',
      },
      {
        stage: 'Phase 3: Creep Gait Optimization & Sensor Stabilization',
        status: 'Planned',
        description: 'Implementing IMU (MPU-6050) feedback loop for active body leveling on uneven ground.',
      },
    ],
    challenges: [
      {
        challenge: 'Synchronous servo movement causing instantaneous current spikes exceeding 4A.',
        solution: 'Implemented a dedicated 5V 5A UBEC and staggered servo pulse activation timings.',
      },
      {
        challenge: 'Mechanical play in micro servo horns causing foot positioning inaccuracy.',
        solution: 'Transitioned to dual-bearing metal-gear servos and reinforced bracket joints.',
      },
    ],
    githubUrl: 'https://github.com/atikrh-beep',
  },
];

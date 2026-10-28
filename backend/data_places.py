"""
CityMate - Tourist Places Dataset
12 Curated Iconic Tourist Attractions for each of the 12 Cities (144 Total Places)
Format per place:
(city_name, category_slug, name, description, address, lat, lng, image_url, gallery_list, rating, review_count, entry_fee, opening_hours, best_time, distance_km, tags_list, is_featured)
"""

PLACES_LIST = [
    # ==========================================
    # 1. COIMBATORE (12 Places)
    # ==========================================
    (
        "Coimbatore", "temple", "Adiyogi Shiva & Isha Yoga Center",
        "An awe-inspiring 112-foot tall bust of Adiyogi consecrated by Sadhguru, nestled at the foot of Velliangiri Mountains. Features the consecrated Dhyanalinga, Surya Kund, and dynamic evening light show.",
        "Velliangiri Foothills, Ishana Vihar, Coimbatore",
        10.9750, 76.7408,
        "assets/places/adiyogi.jpg",
        ["assets/places/adiyogi.jpg", "assets/places/marudhamalai.jpg"],
        4.9, 1420, 0, "6:00 AM - 8:00 PM", "October to March", 28.5,
        ["Spiritual", "Meditation", "Evening Light Show", "Architecture"], 1
    ),
    (
        "Coimbatore", "temple", "Marudhamalai Murugan Temple",
        "Perched atop a granite hill with panoramic vistas of Coimbatore. Believed to possess healing herbs and medicinal spring waters associated with Sage Pambatti Siddhar.",
        "Maruthamalai Adivaram, Coimbatore",
        11.0458, 76.8524,
        "assets/places/marudhamalai.jpg",
        ["assets/places/marudhamalai.jpg", "assets/places/perur.jpg"],
        4.8, 890, 0, "6:00 AM - 8:30 PM", "Year-round", 14.0,
        ["Hilltop", "Spiritual", "Panoramic Views"], 1
    ),
    (
        "Coimbatore", "nature", "Siruvani Waterfalls & Dam",
        "Famed globally for yielding the second tastiest drinking water on Earth. Set amidst dense Western Ghats reserve forests with crystal streams cascading through rocks.",
        "Siruvani Hills, Sadivayal, Coimbatore",
        10.9419, 76.6908,
        "assets/places/siruvani.jpg",
        ["assets/places/siruvani.jpg", "assets/places/kovai_kutralam.jpg"],
        4.7, 650, 50, "10:00 AM - 3:30 PM", "September to January", 35.0,
        ["Waterfalls", "Nature", "Forest Trek", "Sweet Water"], 1
    ),
    (
        "Coimbatore", "museum", "Gedee Car Museum",
        "The only classic automobile museum of its caliber in South India. Houses vintage Rolls Royces, Benz three-wheelers, micro-cars, and unique steam and petrol innovations.",
        "Avanashi Road, Race Course, Coimbatore",
        11.0022, 76.9740,
        "assets/places/gedee_cars.jpg",
        ["assets/places/gedee_cars.jpg"],
        4.7, 780, 100, "9:00 AM - 6:30 PM", "All Seasons", 3.5,
        ["Vintage Cars", "Technology", "Family", "History"], 0
    ),
    (
        "Coimbatore", "shopping", "Brookefields Mall & Cross-Cut Road",
        "Coimbatore's premier lifestyle shopping and dining center, accompanied by the legendary silk and traditional jewellery streets of Gandhipuram.",
        "Dr Krishnasamy Mudaliar Rd, Brookefields, Coimbatore",
        11.0105, 76.9589,
        "assets/places/brookefields.jpg",
        ["assets/places/brookefields.jpg"],
        4.6, 1200, 0, "10:00 AM - 10:00 PM", "All Seasons", 1.8,
        ["Shopping", "Food Court", "Cinema", "Silk"], 0
    ),
    (
        "Coimbatore", "temple", "Eachanari Vinayagar Temple",
        "Famous 6-foot tall idol of Lord Ganesha dating back to 1500 AD, originally bound for Madurai but blessed permanently on the Pollachi Highway.",
        "Pollachi Main Rd, Eachanari, Coimbatore",
        10.9250, 76.9780,
        "assets/places/eachanari.jpg",
        ["assets/places/eachanari.jpg"],
        4.8, 540, 0, "5:30 AM - 9:00 PM", "Year-round", 10.0,
        ["Spiritual", "Heritage", "Ganesha Shrine"], 0
    ),
    (
        "Coimbatore", "historical", "Perur Pateeswarar Temple",
        "Centuries-old temple built by Karikala Chola on the banks of Noyyal River, boasting exquisite stone-carved Kanaka Sabha pillars depicting celestial dance poses.",
        "Siruvani Main Road, Perur, Coimbatore",
        10.9733, 76.9205,
        "assets/places/perur.jpg",
        ["assets/places/perur.jpg"],
        4.7, 430, 0, "6:00 AM - 1:00 PM, 4:00 PM - 8:30 PM", "October to March", 7.0,
        ["Chola Architecture", "Stone Carvings", "Ancient"], 0
    ),
    (
        "Coimbatore", "nature", "Monkey Falls & Aliyar Dam Park",
        "Scenic natural rapids tumbling into serene forest pools, complemented by the boating reservoir, rose garden, and aquarium park of Aliyar.",
        "Pollachi-Valparai Ghat Road, Aliyar",
        10.4900, 76.9600,
        "assets/places/aliyar_dam.jpg",
        ["assets/places/aliyar_dam.jpg"],
        4.6, 620, 30, "7:00 AM - 5:00 PM", "August to February", 65.0,
        ["Waterfalls", "Forest Bathing", "Boating", "Dam View"], 1
    ),
    (
        "Coimbatore", "museum", "Gass Forest Museum & Innovation Hub",
        "Established in 1902 by Horace Arris Gass, housing rare preserved botanical, timber, geological, and wildlife specimens inside the Forest College campus.",
        "Forest College Campus, RS Puram, Coimbatore",
        11.0180, 76.9450,
        "assets/places/gass_forest.jpg",
        ["assets/places/gass_forest.jpg"],
        4.5, 310, 20, "9:00 AM - 5:30 PM", "Year-round", 3.0,
        ["Forestry", "Vintage Specimens", "Educational", "Botanical"], 0
    ),
    (
        "Coimbatore", "adventure", "Valparai Hill Station & Tea Valleys",
        "A serene hill haven perched 3,500 feet high, navigated via 40 hairpin bends with leopard corridors, misty tea plateaus, and roaring Sholayar waters.",
        "Anamalai Tiger Reserve Range, Coimbatore District",
        10.3260, 76.9550,
        "assets/places/tnau_garden.jpg",
        ["assets/places/tnau_garden.jpg"],
        4.8, 950, 0, "6:00 AM - 6:00 PM (Ghat Entry)", "September to March", 100.0,
        ["Tea Gardens", "Hairpin Bends", "Wildlife Safari", "Cool Mist"], 1
    ),
    (
        "Coimbatore", "nature", "Kovai Kutralam Waterfalls",
        "Magnificent forest waterfall located within the protected Siruvani Reserve. Crystal-clear mountain currents cascading over rock slabs surrounded by dense green canopy.",
        "Chadivayal, Siruvani Reserve, Coimbatore",
        10.9380, 76.6850,
        "assets/places/kovai_kutralam.jpg",
        ["assets/places/kovai_kutralam.jpg"],
        4.7, 510, 50, "10:00 AM - 3:00 PM", "September to January", 37.0,
        ["Waterfalls", "Forest Walk", "Eco Tourism"], 0
    ),
    (
        "Coimbatore", "entertainment", "VOC Park, Zoo & Science Center",
        "Iconic central park featuring sprawling recreational green lawns, children's mini-train, aviary and a regional science park with interactive physics exhibits.",
        "Park Gate Road, Gandhipuram, Coimbatore",
        11.0080, 76.9680,
        "assets/places/voc_park.jpg",
        ["assets/places/voc_park.jpg"],
        4.5, 480, 25, "10:00 AM - 7:30 PM", "All Seasons", 1.5,
        ["Family Park", "Kids Play", "Mini Train", "Science Exhibits"], 0
    ),

    # ==========================================
    # 2. CHENNAI (12 Places)
    # ==========================================
    (
        "Chennai", "beach", "Marina Beach & Promenade",
        "The second-longest natural urban beach in the world, spanning 13 km along the Coromandel coast with iconic statues, morning sea breezes, and twilight sundal vendors.",
        "Kamarajar Salai, Triplicane, Chennai",
        13.0499, 80.2824,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 1850, 0, "Open 24/7", "November to February", 3.0,
        ["Beach", "Sunrise", "Lighthouse", "Street Food"], 1
    ),
    (
        "Chennai", "temple", "Kapaleeshwarar Temple, Mylapore",
        "A grand 7th-century Dravidian architectural marvel dedicated to Lord Shiva, renowned for its rainbow-hued Gopuram, temple tank, and vibrant Panguni Peruvizha festivities.",
        "Vadakkumada St, Mylapore, Chennai",
        13.0336, 80.2694,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 1250, 0, "6:00 AM - 12:30 PM, 4:00 PM - 9:00 PM", "Year-round", 4.5,
        ["Dravidian Temple", "Spiritual", "Gopuram", "Mylapore"], 1
    ),
    (
        "Chennai", "historical", "Fort St. George & Museum",
        "Built in 1644 by the British East India Company, marking the origin of modern Madras. Houses St. Mary's Church, grand colonial ramparts, and priceless antiquities.",
        "Rajaji Salai, Fort St George, Chennai",
        13.0797, 80.2871,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 670, 25, "9:00 AM - 5:00 PM (Closed Fridays)", "October to March", 2.0,
        ["Colonial Fort", "British Era", "Museum", "History"], 0
    ),
    (
        "Chennai", "nature", "Guindy National Park & Children's Park",
        "One of the very few national parks situated right inside a metropolis. Protected haven for blackbucks, spotted deer, golden jackals, rare butterflies, and exotic avifauna.",
        "Rangeguindy, Guindy, Chennai",
        13.0067, 80.2206,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.5, 780, 20, "9:00 AM - 5:30 PM (Closed Tuesdays)", "October to March", 8.5,
        ["Wildlife", "Blackbuck", "Nature Walk", "Family"], 0
    ),
    (
        "Chennai", "historical", "San Thome Basilica",
        "A soaring neo-Gothic Catholic cathedral built over the tomb of St. Thomas the Apostle, who arrived in India in 52 AD. Features stunning stained-glass windows.",
        "38 San Thome High Rd, Mylapore, Chennai",
        13.0336, 80.2783,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.8, 920, 0, "6:00 AM - 9:00 PM", "Year-round", 5.0,
        ["Gothic Cathedral", "St Thomas Tomb", "Coastal", "Architecture"], 1
    ),
    (
        "Chennai", "beach", "Edward Elliot's Beach & Besant Nagar",
        "A peaceful coastal haven featuring the historic Karl Schmidt Memorial, scenic ocean boardwalk, vibrant seaside cafes, and quiet evening breezes.",
        "Besant Nagar Beach Rd, Chennai",
        13.0007, 80.2731,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.6, 1100, 0, "Open 24/7", "November to February", 9.0,
        ["Beach Walk", "Cafes", "Sunset", "Memorial"], 0
    ),
    (
        "Chennai", "historical", "DakshinaChitra Living Heritage Village",
        "A cross-cultural living museum showcasing reconstructed heritage homes, folk dances, glass blowing, and artisan craft workshops of Tamil Nadu, Kerala, Karnataka, and Andhra.",
        "East Coast Road, Muttukadu, Chennai",
        12.8236, 80.2417,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 810, 175, "10:00 AM - 6:00 PM (Closed Tuesdays)", "October to March", 25.0,
        ["Living Museum", "Folk Art", "Traditional Architecture", "Crafts"], 1
    ),
    (
        "Chennai", "museum", "Government Museum Chennai & Bronze Gallery",
        "India's second oldest museum complex dating to 1851, housing the world's most magnificent collection of ancient Chola bronze sculptures including Nataraja.",
        "Pantheon Road, Egmore, Chennai",
        13.0694, 80.2572,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 690, 50, "9:30 AM - 5:00 PM (Closed Fridays)", "Year-round", 3.2,
        ["Chola Bronzes", "Archaeology", "Art Gallery", "Numismatics"], 0
    ),
    (
        "Chennai", "nature", "Arignar Anna Zoological Park (Vandalur Zoo)",
        "Spanning 1,265 acres, this is one of Southeast Asia's largest open zoological parks, housing lion safaris, white tigers, chimpanzees, and a nocturnal animal house.",
        "Grand Southern Trunk Rd, Vandalur, Chennai",
        12.8797, 80.0817,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.7, 1340, 90, "9:00 AM - 5:00 PM (Closed Tuesdays)", "October to March", 32.0,
        ["Lion Safari", "White Tiger", "Zoo", "Wildlife Conservation"], 0
    ),
    (
        "Chennai", "historical", "Mahabalipuram Shore Temple & Pancha Rathas",
        "UNESCO World Heritage rock-cut sanctuaries sculpted by the Pallava dynasty right on the crashing waves of Bay of Bengal. Monumental stone chariots and giant relief of Arjuna's Penance.",
        "East Coast Road, Mamallapuram, Chennai Region",
        12.6160, 80.1980,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.9, 1680, 40, "6:00 AM - 6:00 PM", "October to March", 48.0,
        ["UNESCO Heritage", "Pallava Monuments", "Stone Sculptures", "Shore Temple"], 1
    ),
    (
        "Chennai", "historical", "Valluvar Kottam Cultural Monument",
        "Grand stone monument dedicated to the legendary Tamil philosopher-poet Thiruvalluvar. Shaped like a colossal 128-foot temple chariot holding all 1,330 verses of the Thirukkural.",
        "Tirumurthy Nagar, Nungambakkam, Chennai",
        13.0530, 80.2410,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.6, 520, 10, "8:30 AM - 5:30 PM", "All Seasons", 4.0,
        ["Tamil Literature", "Stone Chariot", "Thirukkural", "Heritage"], 0
    ),
    (
        "Chennai", "nature", "Semmozhi Poonga Botanical Garden",
        "A lush 20-acre landscaped eco-botanical garden in the city center featuring over 500 species of medicinal plants, vertical gardens, bonsai courtyards, and tranquil water lily pools.",
        "Cathedral Road, Teynampet, Chennai",
        13.0480, 80.2520,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.6, 610, 25, "10:00 AM - 7:30 PM", "Year-round", 3.8,
        ["Botanical Gardens", "Vertical Gardens", "Floral Enclaves", "Photography"], 0
    ),

    # ==========================================
    # 3. OOTY (12 Places)
    # ==========================================
    (
        "Ooty", "nature", "Government Botanical Garden",
        "Laid out in 1848 on the terraced lower slopes of Doddabetta Peak over 55 sprawling acres, home to a 20-million-year-old fossilized tree trunk, Italian floral terraces, and rare fern houses.",
        "Vannarapettai, Ooty, Tamil Nadu",
        11.4184, 76.7118,
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800",
        ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
        4.8, 1620, 50, "7:00 AM - 6:30 PM", "April to June, September to November", 2.0,
        ["Floral Terraces", "Fossil Tree", "Botanical", "Lush Greens"], 1
    ),
    (
        "Ooty", "adventure", "Doddabetta Peak & Telescope House",
        "The highest summit in the Nilgiri Mountains rising to 8,650 feet. Offers breathtaking 360-degree vistas across mist-cloaked valley slopes and the Chamundi Hills of Mysore.",
        "Doddabetta, Ooty, Tamil Nadu",
        11.4010, 76.7360,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1420, 20, "9:00 AM - 6:00 PM", "October to May", 9.0,
        ["Highest Peak", "Telescope View", "Nilgiri Vistas", "Mist Clouds"], 1
    ),
    (
        "Ooty", "nature", "Pykara Waterfalls & Lake Boating",
        "Sacred river of the Toda tribes flowing through rolling Toda settlements before plummeting down stepped granite rocks and opening into a pristine lake boathouse.",
        "Pykara, Nilgiris District, Tamil Nadu",
        11.5200, 76.5950,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.8, 910, 30, "9:30 AM - 5:30 PM", "July to January", 21.0,
        ["Stepped Falls", "Speedboating", "Shola Forests", "Pykara Lake"], 1
    ),
    (
        "Ooty", "historical", "Nilgiri Mountain Heritage Railway",
        "UNESCO World Heritage meter-gauge rack-and-pinion steam train built in 1908, winding through 16 tunnels, 250 bridges, and romantic Nilgiri tea cliffs.",
        "Ooty Railway Station, Nilgiris, Tamil Nadu",
        11.4060, 76.6960,
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800",
        ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
        4.9, 1950, 205, "Trains operate per Southern Railway schedule", "All Seasons", 1.0,
        ["Toy Train", "UNESCO World Heritage", "Steam Train", "Scenic Bridge"], 1
    ),
    (
        "Ooty", "nature", "Government Rose Garden & Elk Hill Slopes",
        "Perched at 7,200 feet on the slopes of Elk Hill, this is India's largest rose garden showcasing over 20,000 cultivars of hybrid tea roses, miniature roses, and ramblers.",
        "Elk Hill Slopes, Ooty, Tamil Nadu",
        11.4068, 76.7150,
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"],
        4.7, 880, 40, "8:30 AM - 6:00 PM", "March to June", 2.5,
        ["Rose Terraces", "Flora", "Scenic Slopes", "Romantic Walks"], 0
    ),
    (
        "Ooty", "nature", "Ooty Lake & Boathouse",
        "An artificial lake created in 1824 by John Sullivan stretching over 65 scenic acres. Features pedal boats, motor launches, cycling tracks, and amusement rides along the shore.",
        "North Lake Road, Ooty, Tamil Nadu",
        11.4045, 76.6870,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.5, 1250, 30, "9:00 AM - 6:00 PM", "Year-round", 1.5,
        ["Boating", "Pedal Boats", "Lakeside Cycling", "Mini Amusement"], 0
    ),
    (
        "Ooty", "nature", "Avalanche Lake & Shola Eco-Sanctuary",
        "Formed naturally by a landslide in 1823, this tranquil high-altitude water body is surrounded by thick magnolia, rhododendron, and dense Shola cloud forests.",
        "Avalanche Valley, Nilgiris, Tamil Nadu",
        11.3000, 76.5800,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.9, 740, 150, "9:00 AM - 3:00 PM (Forest Safari entry)", "September to March", 28.0,
        ["Untouched Nature", "Forest Safari", "Trout Fishing", "Shola Clouds"], 1
    ),
    (
        "Ooty", "nature", "Emerald Lake & Silent Valley Tea Country",
        "A peaceful turquoise jewel secluded in the Silent Valley region, framed by rolling tea plantations, exotic birdlife, and fragrant eucalyptus groves.",
        "Emerald Village, Nilgiris, Tamil Nadu",
        11.3250, 76.6180,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 620, 0, "6:00 AM - 6:00 PM", "October to April", 22.0,
        ["Turquoise Waters", "Tea Plantations", "Bird Watching", "Serenity"], 0
    ),
    (
        "Ooty", "adventure", "Mudumalai Tiger Reserve & Elephant Safari",
        "Nestled at the tri-junction of Tamil Nadu, Karnataka, and Kerala, this premier tiger reserve shelters Bengal tigers, Asiatic elephants, Indian leopards, and gaur.",
        "Gudalur-Mysore Highway, Theppakadu, Nilgiris",
        11.5800, 76.5300,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.8, 1150, 350, "6:00 AM - 10:00 AM, 2:00 PM - 6:00 PM", "October to May", 42.0,
        ["Tiger Safari", "Wild Elephants", "Canopy Safari", "Jungle Trek"], 1
    ),
    (
        "Ooty", "nature", "Pine Forest & Shooting Medu",
        "Soaring British-era cedar and pine plantations sloping down into scenic valley hollows. A beloved movie filming setting with needle-strewn paths and fragrant mountain air.",
        "Cairn Hill Road, Ooty",
        11.3980, 76.6710,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.7, 730, 20, "8:30 AM - 6:00 PM", "All Seasons", 5.0,
        ["Pine Woods", "Movie Shoots", "Valley Slopes", "Walking Trails"], 0
    ),
    (
        "Ooty", "adventure", "Dolphin's Nose & Catherine Falls View",
        "A dramatic rock cliff resembling a dolphin's snout, jutting thousands of feet over the ravines with panoramic viewpoints of Catherine Falls plunging into deep chasms.",
        "Coonoor Range, Nilgiris District",
        11.3480, 76.8450,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 860, 30, "9:00 AM - 5:30 PM", "September to April", 26.0,
        ["Cliff Edge", "Waterfalls View", "Tea Valleys", "Ghats Vista"], 1
    ),
    (
        "Ooty", "museum", "Tea Factory & Highfield Chocolate Museum",
        "Working factory perched on Dodabetta slope showcasing orthodox Nilgiri tea processing from fresh green leaves to steaming tea tasting, with live chocolate crafting.",
        "Dodabetta Road, Ooty",
        11.4110, 76.7280,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.6, 920, 30, "9:00 AM - 6:30 PM", "Year-round", 4.0,
        ["Tea Processing", "Homemade Chocolate", "Tasting", "Gift Shop"], 0
    ),

    # ==========================================
    # 4. MADURAI (12 Places)
    # ==========================================
    (
        "Madurai", "temple", "Meenakshi Amman Temple",
        "The crown jewel of Dravidian architecture, with 14 colossal Gopurams, the Ashta Shakti Mandapam, the Hall of Thousand Pillars, and the sacred Golden Lotus Tank.",
        "Madurai Main, Madurai, Tamil Nadu",
        9.9195, 78.1193,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.9, 2100, 0, "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM", "October to March", 0.5,
        ["Dravidian Wonder", "Thousand Pillars", "Golden Lotus Tank", "Spiritual Icon"], 1
    ),
    (
        "Madurai", "historical", "Thirumalai Nayakkar Mahal",
        "A classical 17th-century palace built by King Tirumala Nayaka, celebrated for its monumental 82-foot stucco pillars, celestial dome, and nightly sound-and-light show.",
        "Panthadi, Madurai, Tamil Nadu",
        9.9149, 78.1245,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 980, 50, "9:00 AM - 5:00 PM (Light show at 6:45 PM)", "October to March", 1.8,
        ["Indo-Saracenic", "Giant Pillars", "Light & Sound Show", "Nayak Dynasty"], 1
    ),
    (
        "Madurai", "museum", "Gandhi Memorial Museum & Tamukkam Palace",
        "Housed in the 17th-century palace of Rani Mangammal, this historic museum preserves the blood-stained dhoti worn by Mahatma Gandhi when he was assassinated in 1948.",
        "Tamukkam, Madurai, Tamil Nadu",
        9.9320, 78.1360,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 720, 0, "10:00 AM - 1:00 PM, 2:00 PM - 5:45 PM", "Year-round", 4.0,
        ["Gandhi Relics", "Freedom Movement", "Heritage Palace", "History"], 0
    ),
    (
        "Madurai", "temple", "Alagar Kovil & Pazhamudircholai Murugan Temple",
        "A forested temple dedicated to Lord Vishnu set against the Alagar Hills, paired with Pazhamudircholai, one of the sacred Arupadai Veedu shrines of Lord Murugan.",
        "Alagar Kovil Hills, Madurai District",
        10.0760, 78.2140,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 860, 0, "6:00 AM - 8:00 PM", "October to March", 21.0,
        ["Hill Temple", "Lord Murugan", "Scenic Forests", "Sacred Springs"], 1
    ),
    (
        "Madurai", "historical", "Vandiyur Mariamman Teppakulam",
        "A monumental square temple reservoir covering 16 acres with a picturesque granite Maiya Mandapam pavilion in the center, famed for the glittering Float Festival.",
        "Teppakulam, Madurai, Tamil Nadu",
        9.9120, 78.1510,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 640, 0, "Open 24/7", "January to February (Float Festival)", 4.5,
        ["Float Festival", "Temple Tank", "Island Pavilion", "Heritage"], 0
    ),
    (
        "Madurai", "historical", "Samanar Malai Ancient Jain Rock Caves",
        "Ancient rocky hill boasting 2,000-year-old rock-cut Jain carvings, stone inscriptions, and natural caverns where Jain monks meditated in tranquility.",
        "Keelakuyilkudi, Madurai District",
        9.9180, 78.0580,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 480, 0, "6:00 AM - 6:00 PM", "November to February", 12.0,
        ["Jain Caves", "Ancient Inscriptions", "Sunset Trek", "Rock Sculptures"], 0
    ),
    (
        "Madurai", "temple", "Koodal Azhagar Temple",
        "One of the 108 Divya Desams, this ancient temple dedicated to Lord Vishnu features three distinct tiers displaying the deity in sitting, standing, and reclining postures.",
        "Perumal Kovil Sannathi St, Madurai",
        9.9150, 78.1140,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.7, 510, 0, "5:30 AM - 12:00 PM, 4:00 PM - 9:00 PM", "Year-round", 1.0,
        ["Divya Desam", "Three Tiers", "Ancient Sculptures", "Spiritual"], 0
    ),
    (
        "Madurai", "historical", "Kazimar Big Mosque & Maqbara",
        "The oldest Islamic monument in Madurai, founded in the 13th century by Hazrat Kazi Syed Tajuddin, carrying exquisite Persian woodwork and architectural heritage.",
        "Kazimar Street, Periyar, Madurai",
        9.9130, 78.1130,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.7, 430, 0, "5:00 AM - 9:30 PM", "Year-round", 1.2,
        ["13th Century", "Historic Mosque", "Periyar", "Spiritual"], 0
    ),
    (
        "Madurai", "entertainment", "Athisayam Water Theme Park",
        "Sprawling 70-acre water and amusement theme park with high-speed roller-coasters, water slides, lazy rivers, wave pools, and scientific entertainment.",
        "Madurai-Dindigul Road, Paravai, Madurai",
        9.9880, 78.0820,
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800",
        ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"],
        4.6, 750, 700, "10:00 AM - 6:30 PM", "March to August", 12.5,
        ["Water Slides", "Wave Pool", "Family Entertainment", "Thrill Rides"], 0
    ),
    (
        "Madurai", "shopping", "Puthu Mandapam Ancient Craft & Textile Bazaar",
        "A 400-year-old pillared stone pavilion opposite Meenakshi Temple's East Tower, bustling with master tailors, brass artisans, wooden toy craftsmen, and cotton weavers.",
        "Opposite East Tower, Meenakshi Amman Temple, Madurai",
        9.9190, 78.1210,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.8, 890, 0, "9:00 AM - 9:30 PM", "Year-round", 0.6,
        ["Pillared Bazaar", "Tailoring", "Brass Craft", "Madurai Sungudi Sarees"], 1
    ),
    (
        "Madurai", "historical", "Goripalayam Dargah",
        "A prominent 13th-century twin-tomb shrine situated on the northern bank of Vaigai River, known for its massive 70-foot single stone dome and harmonious festive traditions.",
        "Chithirai Street, Goripalayam, Madurai",
        9.9310, 78.1280,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.7, 480, 0, "6:00 AM - 9:00 PM", "Year-round", 3.0,
        ["Historic Dargah", "Stone Dome", "Vaigai Riverbank", "Spiritual"], 0
    ),
    (
        "Madurai", "historical", "St. Mary's Cathedral Church",
        "One of the oldest Catholic churches in India established in 1840, presenting a magnificent fusion of European Roman and continental Gothic bell towers.",
        "East Veli Street, Madurai",
        9.9170, 78.1260,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.6, 510, 0, "6:00 AM - 8:30 PM", "Year-round", 1.5,
        ["Gothic Cathedral", "Stained Glass", "Bell Towers", "Heritage"], 0
    ),

    # ==========================================
    # 5. SALEM (12 Places)
    # ==========================================
    (
        "Salem", "nature", "Yercaud Lake & Emerald Valley",
        "Picturesque jewel nestled in the Shevaroy Hills at 4,970 feet, surrounded by lush gardens, pedal boats, and cool misty mountain breezes.",
        "Yercaud Town, Shevaroy Hills, Salem District",
        11.7753, 78.2093,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1120, 30, "9:00 AM - 5:30 PM", "October to June", 31.0,
        ["Hill Station Lake", "Boating", "Deer Park", "Cool Breeze"], 1
    ),
    (
        "Salem", "adventure", "Kiliyur Falls & Forest Trek",
        "A dramatic 300-foot waterfall cascading into the lush Shervaroyan canyon, approached via a thrilling trek through coffee and citrus orchards.",
        "Kiliyur Falls Road, Yercaud, Salem District",
        11.7930, 78.2020,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.6, 730, 10, "8:00 AM - 5:00 PM", "July to January", 35.0,
        ["300ft Falls", "Jungle Trek", "Adventure Trail", "Coffee Groves"], 1
    ),
    (
        "Salem", "nature", "Lady's Seat & Pagoda Point Viewpoints",
        "Panoramic rock-face viewpoints offering sweeping eagle-eye vistas of Salem city lights below and winding Ghat hairpin curves.",
        "Lady's Seat Road, Yercaud, Salem District",
        11.7680, 78.2040,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 850, 20, "7:00 AM - 7:00 PM", "October to May", 32.5,
        ["Sunset Point", "Ghat Road Views", "Telescope View", "Valley Panorama"], 1
    ),
    (
        "Salem", "nature", "Kurumbapatti Zoological Park",
        "Sprawling eco-park located at the foothills of Shevaroy range, sheltering spotted deer, sambar, marsh crocodiles, and colorful avifauna.",
        "Kurumbapatti, Salem, Tamil Nadu",
        11.7220, 78.1620,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.5, 590, 25, "9:00 AM - 5:00 PM (Closed Tuesdays)", "October to March", 12.0,
        ["Zoological Park", "Foothills", "Family Picnic", "Bird Watching"], 0
    ),
    (
        "Salem", "temple", "1008 Shiva Lingam Hilltop Temple",
        "Perched on Ariyanoor Hill, this sacred complex features 1,007 small stone Shiva Lingams symmetrically encircling one colossal main Lingam.",
        "Ariyanoor, NH-47, Salem, Tamil Nadu",
        11.6020, 78.0640,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.6, 680, 0, "6:30 AM - 12:30 PM, 4:00 PM - 8:00 PM", "Year-round", 14.0,
        ["1008 Lingams", "Hilltop Shrine", "Panoramic Views", "Spiritual"], 0
    ),
    (
        "Salem", "historical", "Mettur Dam & Stanley Reservoir Park",
        "One of India's oldest and grandest masonry gravity dams built across Kaveri River in 1934, paired with lush terraced water fountain parks.",
        "Mettur, Salem District, Tamil Nadu",
        11.8000, 77.8000,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1310, 20, "9:00 AM - 5:30 PM", "August to January", 52.0,
        ["Kaveri River", "Colossal Dam", "Terraced Park", "Engineering Marvel"], 1
    ),
    (
        "Salem", "temple", "Kottai Mariamman Historic Temple",
        "An ancient 500-year-old sanctum in the heart of Salem Fort, famed for the grand Aadi festival where devotees gather for sacred blessings.",
        "I Agraharam, Salem, Tamil Nadu",
        11.6540, 78.1580,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 610, 0, "6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM", "Year-round", 1.5,
        ["Historic Sanctum", "Aadi Festival", "Fort Salem", "Spiritual"], 0
    ),
    (
        "Salem", "nature", "Shevaroy Temple & Bear's Cave",
        "The highest peak in Yercaud (5,326 ft) crowned by a cave temple dedicated to Lord Shevaroyan, nearby the mysterious historical Bear's Cave.",
        "Shevaroy Peak, Yercaud, Salem District",
        11.8010, 78.2250,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 780, 0, "6:00 AM - 6:00 PM", "October to May", 36.0,
        ["Highest Summit", "Cave Temple", "Shevaroy Range", "Mountain Mist"], 1
    ),
    (
        "Salem", "nature", "Anna Park & Japanese Silk Garden",
        "Lovely landscaped flower park near Yercaud lake featuring Japanese garden architecture, floral topiary, and an orchidarium hosting rare mountain orchids.",
        "Near Yercaud Lake, Salem District",
        11.7780, 78.2100,
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"],
        4.5, 490, 20, "9:00 AM - 6:00 PM", "March to June", 31.5,
        ["Japanese Garden", "Orchidarium", "Floral Topiary", "Family Leisure"], 0
    ),
    (
        "Salem", "historical", "Sankagiri Fort & Hilltop Bastion",
        "A monumental 15th-century Vijayanagara hilltop fortress featuring 14 defensive rampart walls, weapons vaults, and historic prison chambers.",
        "Sankagiri, Salem District",
        11.4820, 77.8690,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 520, 0, "7:00 AM - 5:30 PM", "October to March", 38.0,
        ["Hilltop Fortress", "14 Fort Walls", "Vijayanagara History", "Trek"], 0
    ),
    (
        "Salem", "temple", "Sugavaneswarar Temple",
        "Ancient Shiva temple situated in the heart of Salem, believed to have been worshiped by Sage Suka Brahmarishi with sacred parrot inscriptions.",
        "Center Town, Salem",
        11.6580, 78.1560,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.7, 440, 0, "6:00 AM - 12:30 PM, 4:30 PM - 8:30 PM", "Year-round", 1.0,
        ["Sage Suka", "Ancient Shiva Temple", "Town Center", "Dravidian"], 0
    ),
    (
        "Salem", "nature", "Pagoda Point & Raja Rajeshwari Temple",
        "Scenic ridge outlook adorned with four ancient pyramid stone piles constructed by local tribes, providing stunning valley views of Harur plains.",
        "Eastern Slopes, Yercaud, Salem District",
        11.7760, 78.2280,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 680, 15, "6:30 AM - 6:30 PM", "October to May", 34.0,
        ["Pyramid Stones", "Eastern Ridge", "Temple View", "Cool Breeze"], 0
    ),

    # ==========================================
    # 6. BENGALURU (12 Places)
    # ==========================================
    (
        "Bengaluru", "nature", "Lalbagh Botanical Gardens & Glass House",
        "Commissioned in 1760 by Hyder Ali and completed by Tipu Sultan, this 240-acre botanical haven features the iconic London Crystal Palace-modeled Glass House.",
        "Mavalli, Bengaluru, Karnataka",
        12.9507, 77.5848,
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
        4.8, 2450, 30, "6:00 AM - 7:00 PM", "All Seasons (Flower Shows in Jan & Aug)", 4.0,
        ["Glass House", "Centuries Old Trees", "Lotus Lake", "Flower Shows"], 1
    ),
    (
        "Bengaluru", "historical", "Bangalore Tudor Palace & Grounds",
        "Built in 1878 by Chamarajendra Wadiyar X in Tudor Revival style, adorned with fortified towers, woodcarvings, Victorian stained glass, and royal hunting trophies.",
        "Vasanth Nagar, Bengaluru, Karnataka",
        12.9988, 77.5921,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 1820, 250, "10:00 AM - 5:30 PM", "Year-round", 3.5,
        ["Tudor Palace", "Wadiyar Dynasty", "Royal Artifacts", "Grand Ballrooms"], 1
    ),
    (
        "Bengaluru", "entertainment", "Wonderla Amusement & Water Park",
        "India's top-rated mega amusement park featuring 60+ world-class high-thrill rides, solar-heated wave pools, reverse roller-coasters, and sky wheels.",
        "28th km, Mysore Road, Bengaluru, Karnataka",
        12.8343, 77.4011,
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800",
        ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"],
        4.9, 3100, 1350, "11:00 AM - 6:00 PM (Weekdays), 11:00 AM - 7:00 PM (Weekends)", "All Seasons", 28.0,
        ["Thrill Rides", "Wave Pools", "Roller Coasters", "Family Fun"], 1
    ),
    (
        "Bengaluru", "nature", "Cubbon Park & Attara Kacheri",
        "Sprawling 300-acre green lung in central Bangalore established in 1870, home to bamboo thickets, colonial statues, and the neo-classical red Attara Kacheri.",
        "Kasturba Road, Bengaluru, Karnataka",
        12.9763, 77.5929,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.7, 1950, 0, "6:00 AM - 8:00 PM", "Year-round", 1.0,
        ["Green Lungs", "Colonial Heritage", "Bamboo Grooves", "Morning Walk"], 0
    ),
    (
        "Bengaluru", "adventure", "Bannerghatta Biological Safari & Butterfly Park",
        "Premier 25,000-acre biological reserve offering AC bus safaris to observe tigers, lions, and bears roaming freely, alongside India's first enclosed tropical Butterfly Park.",
        "Bannerghatta Main Rd, Bengaluru, Karnataka",
        12.8009, 77.5777,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.7, 1680, 350, "9:30 AM - 5:00 PM (Closed Tuesdays)", "October to March", 22.0,
        ["Tiger Safari", "Butterfly Dome", "Bear Enclave", "Elephant Sanctuary"], 1
    ),
    (
        "Bengaluru", "historical", "Tipu Sultan's Summer Palace & Bangalore Fort",
        "Exquisite two-story Indo-Islamic teakwood palace built entirely of carved wood pillars, arches, and balconies, accompanied by the stone ramparts of Bangalore Fort.",
        "Albert Victor Road, Chamrajpet, Bengaluru",
        12.9593, 77.5737,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 920, 20, "8:30 AM - 5:30 PM", "Year-round", 3.0,
        ["Teakwood Palace", "Tipu Sultan", "Bangalore Fort", "Indo-Islamic"], 0
    ),
    (
        "Bengaluru", "museum", "Visvesvaraya Industrial & Technological Museum",
        "Interactive science wonder honoring Sir M. Visvesvaraya, with hands-on engines, biotechnology labs, 3D space theater, and life-size animated dinosaurs.",
        "Kasturba Road, Cubbon Park, Bengaluru",
        12.9752, 77.5963,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
        4.8, 1420, 85, "9:30 AM - 6:00 PM", "All Seasons", 1.2,
        ["Interactive Science", "Dinosaur Enclave", "Space Theater", "Innovation"], 0
    ),
    (
        "Bengaluru", "temple", "ISKCON Temple Bangalore (Sri Radha Krishna-chandra)",
        "Colossal neo-classical cultural shrine situated on Hare Krishna Hill, combining glass-and-brass temple towers with spiritual meditation halls and prasadam feasts.",
        "Hare Krishna Hill, Rajajinagar, Bengaluru",
        13.0098, 77.5511,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 2200, 0, "4:15 AM - 5:00 AM, 7:15 AM - 1:00 PM, 4:15 PM - 8:30 PM", "Year-round", 7.0,
        ["Spiritual Hub", "Grand Architecture", "Prasadam", "Hare Krishna Hill"], 1
    ),
    (
        "Bengaluru", "shopping", "UB City Sky Lounge & Art Pavilion",
        "India's first luxury commercial mall and skyscraper hub, hosting upscale global boutiques, contemporary rooftop dining, and open-air art amphitheatres.",
        "24 Vittal Mallya Road, Bengaluru",
        12.9719, 77.5958,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.8, 1680, 0, "10:30 AM - 11:30 PM", "All Seasons", 0.8,
        ["Luxury Plaza", "Sky Lounge", "Art Gallery", "Fine Dining"], 1
    ),
    (
        "Bengaluru", "museum", "National Gallery of Modern Art (NGMA)",
        "Housed in the historic Manikyavelu Mansion surrounded by lotus ponds, displaying masterworks of Raja Ravi Varma, Amrita Sher-Gil, and Rabindranath Tagore.",
        "49 Palace Road, Bengaluru",
        12.9890, 77.5880,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 790, 20, "10:00 AM - 6:00 PM (Closed Mondays)", "Year-round", 2.5,
        ["Modern Art", "Heritage Mansion", "Sculpture Garden", "Tagore Works"], 0
    ),
    (
        "Bengaluru", "shopping", "Commercial Street & Russell Market",
        "Bengaluru's most vibrant bustling shopping artery, famous for silk, pashminas, artisanal jewelry, and the colonial heritage Russell Market.",
        "Tasker Town, Shivaji Nagar, Bengaluru",
        12.9820, 77.6080,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.6, 1850, 0, "10:30 AM - 9:30 PM", "All Seasons", 2.2,
        ["Street Shopping", "Boutiques", "Textiles", "Bazaar"], 0
    ),
    (
        "Bengaluru", "nature", "Ulsoor Lake & Boating Promenade",
        "Sprawling 120-acre urban lake established by Kempe Gowda II, adorned with green islets, boat cruises, and paved morning walking boulevards.",
        "Halasuru, Bengaluru",
        12.9830, 77.6200,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 910, 0, "6:00 AM - 8:00 PM (Boating till 6 PM)", "All Seasons", 3.8,
        ["Urban Lake", "Boating", "Islets", "Jogging Track"], 0
    ),

    # ==========================================
    # 7. KODAIKANAL (12 Places)
    # ==========================================
    (
        "Kodaikanal", "nature", "Kodaikanal Lake & Star-Shaped Promenade",
        "A magnificent star-shaped artificial lake built in 1863 spanning 60 acres, fringed by weeping willows, rowboats, pedal craft, and horse trails.",
        "Lake Road, Kodaikanal, Tamil Nadu",
        10.2330, 77.4900,
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800",
        ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
        4.8, 1720, 30, "6:00 AM - 6:30 PM", "September to May", 0.5,
        ["Star Lake", "Boating", "Horse Riding", "Cycle Track"], 1
    ),
    (
        "Kodaikanal", "adventure", "Coaker's Walk & Cloud Viewpoint",
        "A 1-kilometer pedestrian mountain path constructed in 1872 on steep valley slopes, offering surreal views of drifting clouds and the plains of Madurai.",
        "Coakers Walk, Kodaikanal, Tamil Nadu",
        10.2310, 77.4970,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1340, 30, "7:00 AM - 7:00 PM", "October to April", 1.0,
        ["Cliff Walk", "Cloud Sea", "Telescope House", "Mountain Vistas"], 1
    ),
    (
        "Kodaikanal", "nature", "Pillar Rocks & Guna Caves",
        "Three giant granite rock boulders soaring 400 feet vertically into mountain clouds, overlooking misty chasms and deep cavernous geological crevices.",
        "Pillar Rocks Rd, Kodaikanal, Tamil Nadu",
        10.2100, 77.4680,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.7, 1150, 20, "9:00 AM - 5:00 PM", "October to May", 7.5,
        ["Pillar Rocks", "Mist Chasms", "Granite Cliffs", "Guna Caves"], 1
    ),
    (
        "Kodaikanal", "nature", "Bryant Park & Botanical Glasshouse",
        "Manicured 20-acre botanical showcase established in 1908 by H.D. Bryant, featuring hybrid rose beds, a historic Bodhi tree, and annual horticultural festivals.",
        "Lower Shola Rd, Kodaikanal, Tamil Nadu",
        10.2340, 77.4950,
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"],
        4.6, 890, 30, "9:00 AM - 6:00 PM", "April to June, September to December", 0.8,
        ["Horticulture", "Glasshouse", "Rose Beds", "Picnic Greens"], 0
    ),
    (
        "Kodaikanal", "nature", "Silver Cascade Falls",
        "A roaring 180-foot waterfall formed by the outflow of Kodai Lake, cascading over sleek black granite cliffs right along the mountain Ghat road.",
        "Kodaikanal Ghat Road, Tamil Nadu",
        10.2450, 77.5180,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.5, 780, 0, "Open 24/7", "July to January", 8.0,
        ["Roadside Falls", "Roaring Cascade", "Ghat Entry", "Mountain Sprays"], 0
    ),
    (
        "Kodaikanal", "nature", "Pine Forest & Shola Woods",
        "Century-old British pine woodlands cultivated in 1906 by Mr. Bryant. Needle-cushioned terrain surrounded by soaring straight trunks and atmospheric mountain mist.",
        "Pine Forest Road, Kodaikanal",
        10.2180, 77.4720,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.8, 980, 20, "8:30 AM - 6:00 PM", "All Seasons", 6.0,
        ["Tall Pines", "Forest Walks", "Photography", "Quiet Trails"], 1
    ),
    (
        "Kodaikanal", "adventure", "Dolphin's Nose & Echo Rock (Vattakanal)",
        "A natural flat rock protrusion jutting out over a 6,600-foot precipice in the hippie enclave of Vattakanal. Unsurpassed views of gorges and distant villages.",
        "Vattakanal Trail, Kodaikanal",
        10.2150, 77.4980,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 1220, 20, "6:00 AM - 5:30 PM", "October to April", 5.5,
        ["Precipice", "Echo Rock", "Vattakanal", "Trek"], 1
    ),
    (
        "Kodaikanal", "temple", "Chettiar Park & Kurinji Andavar Temple",
        "Famous hilltop shrine dedicated to Lord Murugan, celebrated as the epicenter of the mythical Kurinji flower that blossoms once every 12 years across the valley.",
        "Kurinji Andavar Temple Road, Kodaikanal",
        10.2520, 77.5020,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.6, 610, 0, "7:00 AM - 7:00 PM", "Year-round", 3.8,
        ["Kurinji Flower", "Murugan Temple", "Valley Views", "Chettiar Park"], 0
    ),
    (
        "Kodaikanal", "nature", "Mannavanur Eco-Lake & Sheep Farm",
        "A serene alpine farming meadow situated 35 km from town. Rolling green hills grazing high-altitude sheep, pine woods, and a quiet lake with coracle boating.",
        "Mannavanur Village, Kodaikanal Hills",
        10.2850, 77.3500,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 790, 50, "9:00 AM - 5:00 PM", "September to May", 35.0,
        ["Alpine Meadow", "Sheep Farm", "Coracle Boating", "Eco Tourism"], 1
    ),
    (
        "Kodaikanal", "nature", "Bear Shola Falls",
        "A tranquil secluded forest waterfall tucked inside a reserve valley where bears once drank. Pristine cascades surrounded by wild ferns and rocky trails.",
        "Bear Shola Road, Kodaikanal",
        10.2410, 77.4830,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.5, 540, 0, "10:00 AM - 5:00 PM", "July to December", 2.5,
        ["Forest Waterfall", "Shola Trees", "Hiking Trail", "Serene"], 0
    ),
    (
        "Kodaikanal", "museum", "Solar Observatory & Astronomy Museum",
        "Founded in 1899 at the highest point of Kodai (7,700 ft). Houses solar telescopes, an astronomy library, and solar physics exhibits that discovered the Evershed effect.",
        "Observatory Road, Kodaikanal",
        10.2320, 77.4650,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
        4.7, 480, 50, "10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM", "October to May", 6.0,
        ["Solar Observatory", "Astronomy", "Evershed Effect", "Highest Point"], 0
    ),
    (
        "Kodaikanal", "nature", "Moir Point Viewpoint",
        "Historical viewpoint named after Sir Thomas Moir, marking the entrance to Berijam Lake road with breathtaking vistas over green valleys and sheer granite cliffs.",
        "Berijam Road, Kodaikanal",
        10.2110, 77.4580,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 570, 20, "9:00 AM - 5:00 PM", "October to May", 8.2,
        ["Scenic Outlook", "Berijam Gateway", "Granite Cliffs", "Mist Clouds"], 0
    ),

    # ==========================================
    # 8. PONDICHERRY (12 Places)
    # ==========================================
    (
        "Pondicherry", "beach", "Promenade Beach & Goubert Avenue",
        "The iconic 1.5-km seaside boulevard of French Quarter, closed to motorized traffic in the evening, flanked by colonial statues, French villas, and rolling blue waves.",
        "Goubert Ave, White Town, Puducherry",
        11.9338, 79.8359,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 1950, 0, "Open 24/7 (Promenade walking hours 5 PM - 6 AM)", "October to March", 0.5,
        ["French Promenade", "Sunset Stroll", "War Memorial", "Sea Breeze"], 1
    ),
    (
        "Pondicherry", "historical", "Auroville & Golden Matrimandir",
        "An experimental international township dedicated to human unity, crowned by the colossal gold-plated sphere Matrimandir and its silent crystal meditation chamber.",
        "Auroville, Viluppuram District / Puducherry",
        12.0070, 79.8107,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.9, 2150, 0, "9:00 AM - 5:30 PM (Passes required for inner chamber)", "October to March", 11.0,
        ["Golden Globe", "Human Unity", "Meditation", "Peace Garden"], 1
    ),
    (
        "Pondicherry", "temple", "Sri Aurobindo Ashram",
        "Spiritual sanctum founded in 1926 by Sri Aurobindo and Mirra Alfassa (The Mother), preserving their floral samadhi in a serene tree-shaded marble courtyard.",
        "Rue de la Marine, White Town, Puducherry",
        11.9366, 79.8347,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 1280, 0, "8:00 AM - 12:00 PM, 2:00 PM - 6:00 PM", "Year-round", 0.8,
        ["Spiritual Peace", "Samadhi", "White Town", "Meditation Courtyard"], 1
    ),
    (
        "Pondicherry", "beach", "Paradise Beach & Chunnambar Ferry",
        "An isolated golden sand spit accessible solely via a scenic 15-minute backwater boat cruise along the Chunnambar river, boasting pristine waves and water sports.",
        "Chunnambar, Nonankuppam, Puducherry",
        11.8750, 79.8080,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.7, 1450, 350, "9:00 AM - 5:00 PM", "October to March", 8.0,
        ["Ferry Ride", "Golden Sand", "Backwater Cruise", "Water Sports"], 1
    ),
    (
        "Pondicherry", "historical", "French War Memorial & White Town Quarter",
        "Graceful memorial honoring French soldiers of World War I, nestled amidst French colonial boulevards lined with pastel-yellow villas, wrought iron balconies, and bistros.",
        "Goubert Ave, White Town, Puducherry",
        11.9320, 79.8350,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 890, 0, "10:00 AM - 5:00 PM", "Year-round", 0.6,
        ["French Architecture", "White Town", "Boulevards", "War Memorial"], 0
    ),
    (
        "Pondicherry", "beach", "Serenity Beach & Surfing School",
        "A crescent-shaped golden beach with gentle blue surf breaks, lined with fishing catamarans, beach shacks, and a premier ISA-certified surfing academy.",
        "Kottakuppam, East Coast Road, Pondicherry",
        11.9680, 79.8450,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.7, 980, 0, "Open 24/7", "November to March", 5.5,
        ["Surfing Lessons", "Golden Surf", "Beach Shacks", "Sunset Waves"], 1
    ),
    (
        "Pondicherry", "nature", "Botanical Garden & Heritage Toy Train",
        "Established in 1826 by French botanist C.S. Perrottet over 22 green acres. Features grand French garden layouts, exotic flora from across the globe, and a mini toy train.",
        "Subbaiah Salai, Puducherry",
        11.9280, 79.8240,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.6, 620, 20, "9:00 AM - 6:00 PM", "October to March", 1.8,
        ["French Botanics", "Exotic Trees", "Toy Train", "Fountain Show"], 0
    ),
    (
        "Pondicherry", "historical", "Basilica of the Sacred Heart of Jesus",
        "Stunning neo-Gothic Catholic basilica constructed in 1907 by French missionaries. Famed for its towering twin steeples, rare stained-glass depictions, and Corinthian pillars.",
        "South Boulevard, Puducherry",
        11.9260, 79.8280,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.8, 870, 0, "6:00 AM - 8:30 PM", "Year-round", 1.5,
        ["Neo Gothic", "Twin Spires", "Stained Glass", "French Heritage"], 0
    ),
    (
        "Pondicherry", "adventure", "Chunnambar Boat House & Mangrove Lagoons",
        "Picturesque backwater complex where the Chunnambar River meets the Bay of Bengal. Offers pedal boating, motorized mangrove cruises, and treehouse retreats.",
        "Chunnambar, Cuddalore Road, Puducherry",
        11.8790, 79.8050,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 810, 50, "9:00 AM - 5:30 PM", "October to March", 7.5,
        ["Backwaters", "Mangrove Cruises", "Pedal Boating", "Eco Paradise"], 0
    ),
    (
        "Pondicherry", "museum", "Pondicherry Museum & Sculptures Gallery",
        "Housed in the historic Law de Lauriston building, showcasing Roman amphorae excavated from ancient Arikamedu, French royal carriages, and bronze Chola sculptures.",
        "Saint Louis Street, White Town, Puducherry",
        11.9340, 79.8340,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 520, 20, "9:00 AM - 5:00 PM (Closed Mondays)", "Year-round", 0.7,
        ["Roman Relics", "French Antiques", "Arikamedu", "Bronze Sculptures"], 0
    ),
    (
        "Pondicherry", "historical", "Arikamedu Roman-Indian Port Site",
        "Ancient 2nd-century BC Indo-Roman trade port where Roman pottery, beads, glassware, and wine amphorae were excavated, proving deep Greco-Roman trade ties.",
        "Ariyankuppam Riverbank, Puducherry",
        11.8980, 79.8230,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.5, 380, 0, "9:00 AM - 5:00 PM", "October to March", 6.0,
        ["Roman Port", "Archaeology", "Ancient History", "Riverbank Ruins"], 0
    ),
    (
        "Pondicherry", "nature", "Auroville Matrimandir Viewing Point & Gardens",
        "The open serene amphitheatre and viewing pavilion surrounded by 12 manicured petals and tranquil shaded gardens offering contemplative vistas of the Golden Matrimandir.",
        "Auroville Central Enclave",
        12.0060, 79.8120,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 1420, 0, "9:00 AM - 4:30 PM", "October to March", 11.5,
        ["Viewing Pavilion", "Banyan Tree", "Peace Garden", "Auroville"], 1
    ),

    # ==========================================
    # 9. KANYAKUMARI (12 Places)
    # ==========================================
    (
        "Kanyakumari", "historical", "Vivekananda Rock Memorial & Ferry",
        "A sacred monument erected in 1970 on two granite rock islets 500 meters offshore where Swami Vivekananda attained enlightenment after 3 days of deep meditation in 1892.",
        "Vivekanandapuram Offshore, Kanyakumari, Tamil Nadu",
        8.0780, 77.5550,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.9, 2350, 75, "8:00 AM - 4:00 PM (Ferry operations subject to tide)", "October to March", 0.8,
        ["Offshore Rock", "Ferry Ride", "Swami Vivekananda", "Three Oceans"], 1
    ),
    (
        "Kanyakumari", "historical", "Thiruvalluvar 133-ft Stone Statue",
        "A colossal 133-foot granite statue honoring immortal Tamil saint-poet Thiruvalluvar, standing tall amidst crashing ocean waves, symbolizing the 133 chapters of the Tirukkural.",
        "Offshore Island, Kanyakumari, Tamil Nadu",
        8.0770, 77.5560,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 1680, 0, "8:00 AM - 4:00 PM (Accessible via Rock Memorial ferry)", "October to March", 0.9,
        ["133ft Statue", "Tamil Saint", "Granite Wonder", "Ocean Landmark"], 1
    ),
    (
        "Kanyakumari", "beach", "Kanyakumari Beach & Triveni Sangam",
        "The sacred geographic confluence where the Indian Ocean, Arabian Sea, and Bay of Bengal converge, famed worldwide for simultaneous sunrise and sunset spectacles.",
        "Beach Road, Kanyakumari, Tamil Nadu",
        8.0800, 77.5530,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.7, 1850, 0, "Open 24/7", "October to March", 0.3,
        ["Triveni Sangam", "Sunrise Point", "Three Oceans", "Sunset View"], 1
    ),
    (
        "Kanyakumari", "historical", "Padmanabhapuram Palace",
        "A magnificent 16th-century wooden palace of the Travancore Kings, boasting intricately carved rosewood ceilings, mica windows, Chinese carved thrones, and secret tunnels.",
        "Thuckalay, Kanyakumari District, Tamil Nadu",
        8.2508, 77.3275,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 1220, 50, "9:00 AM - 4:30 PM (Closed Mondays)", "Year-round", 34.0,
        ["Travancore Palace", "Teak Woodcarvings", "Secret Tunnels", "Royal Architecture"], 1
    ),
    (
        "Kanyakumari", "temple", "Bhagavathy Amman Temple",
        "A 3,000-year-old historic coastal shrine dedicated to virgin Goddess Kanya Kumari, renowned for the brilliant ruby nose-ring of the deity that illuminated passing ships.",
        "Temple Street, Kanyakumari, Tamil Nadu",
        8.0815, 77.5540,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 1140, 0, "4:30 AM - 12:30 PM, 4:00 PM - 8:30 PM", "Year-round", 0.4,
        ["3000 Year Old", "Devi Temple", "Ruby Nose Ring", "Sacred Seafront"], 0
    ),
    (
        "Kanyakumari", "nature", "Sunset Point & Hidden Beach",
        "Scenic sandy beach enclave located 2 km southwest of town, offering uninterrupted wide horizons to witness the sun sinking into the Arabian Sea.",
        "Kovalam Road, Kanyakumari",
        8.0830, 77.5350,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.7, 920, 0, "Open 24/7", "October to March", 2.2,
        ["Sunset Panorama", "Arabian Sea", "Sandy Shore", "Twilight Breeze"], 1
    ),
    (
        "Kanyakumari", "historical", "Gandhi Memorial Mandapam",
        "Built in Orissa temple style on the spot where Mahatma Gandhi's ashes were placed before immersion. On his birthday (Oct 2), sunrays pass through a ceiling aperture onto the pedestal.",
        "Sea Shore, Kanyakumari",
        8.0810, 77.5520,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 750, 10, "7:00 AM - 7:00 PM", "Year-round", 0.5,
        ["Gandhi Memorial", "Sun Ray Design", "Seafront", "History"], 0
    ),
    (
        "Kanyakumari", "historical", "Vattakottai Fort (Circular Sea Fort)",
        "An 18th-century seaside granite coastal fort constructed under the Travancore Kingdom by Dutch naval officer Eustachius De Lannoy, with cannon ramps overlooking crashing waves.",
        "Vattakottai, Kanyakumari District",
        8.1250, 77.5650,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 880, 25, "8:00 AM - 5:30 PM", "October to March", 6.5,
        ["Coastal Sea Fort", "Black Sand Beach", "Cannons", "Western Ghats Backdrop"], 1
    ),
    (
        "Kanyakumari", "historical", "Our Lady of Ransom Church",
        "A soaring 100-year-old Portuguese Gothic cathedral on the beach with 153-foot golden-cross towers, colorful stained glass, and illuminated nighttime facades.",
        "Church Road, Kanyakumari",
        8.0820, 77.5510,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.7, 690, 0, "5:30 AM - 8:30 PM", "Year-round", 0.7,
        ["Gothic Cathedral", "Portuguese Heritage", "Night Lights", "Coastal"], 0
    ),
    (
        "Kanyakumari", "nature", "Thirparappu Waterfalls & Temple",
        "Picturesque river waterfalls formed by the Kodayar River tumbling over 50 feet of rocky bed into a natural bathing basin, flanked by a 9th-century Shiva temple.",
        "Thirparappu, Kanyakumari District",
        8.3850, 77.2650,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.6, 780, 20, "7:00 AM - 6:00 PM", "August to February", 52.0,
        ["River Falls", "Shiva Shrine", "Natural Pool", "Pedal Boating"], 0
    ),
    (
        "Kanyakumari", "entertainment", "Baywatch Amusement & Water Park",
        "A premier family water amusement park on Kanyakumari-Trivandrum Highway, featuring India's first complete wax museum, giant wheel, and wave splash pools.",
        "NH 44, Kovalam Road, Kanyakumari",
        8.0950, 77.5400,
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800",
        ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"],
        4.5, 620, 550, "10:00 AM - 6:30 PM", "All Seasons", 2.0,
        ["Wax Museum", "Water Slides", "Wave Pool", "Family Park"], 0
    ),
    (
        "Kanyakumari", "nature", "Chothavilai Beach & Sand Dunes",
        "One of the longest pristine beaches in Tamil Nadu, with clean white sand dunes, coastal pine groves, and shallow turquoise waters ideal for ocean wading.",
        "Chothavilai, Kanyakumari District",
        8.1320, 77.4850,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.6, 510, 0, "Open 24/7", "October to March", 10.5,
        ["Longest Beach", "Sand Dunes", "Pine Trees", "Peaceful"], 0
    ),

    # ==========================================
    # 10. THANJAVUR (12 Places)
    # ==========================================
    (
        "Thanjavur", "temple", "Brihadeeswara Temple (Big Temple)",
        "The undisputed masterpiece of Chola architecture built in 1010 AD by Raja Raja Chola I. Features a 216-foot granite Vimana crowned by an 80-ton single-stone dome.",
        "Membalam Rd, Balaganapathy Nagar, Thanjavur, Tamil Nadu",
        10.7828, 79.1318,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.9, 2450, 0, "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM", "October to March", 1.0,
        ["UNESCO World Heritage", "Big Temple", "Chola Architecture", "Granite Vimana"], 1
    ),
    (
        "Thanjavur", "historical", "Thanjavur Maratha Palace & Bell Tower",
        "An imposing palace complex constructed by Nayak rulers and enhanced by Maratha kings. Features seven-story observation Bell Tower and the ornate Durbar Hall.",
        "East Main St, Thanjavur, Tamil Nadu",
        10.7925, 79.1370,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 1180, 50, "9:00 AM - 6:00 PM", "October to March", 1.5,
        ["Maratha Palace", "Durbar Hall", "Bell Tower", "Nayak Architecture"], 1
    ),
    (
        "Thanjavur", "museum", "Saraswathi Mahal Library & Museum",
        "One of the oldest medieval libraries in Asia, housing over 60,000 rare palm-leaf manuscripts written in Sanskrit, Tamil, Marathi, and Telugu.",
        "Inside Palace Complex, Thanjavur, Tamil Nadu",
        10.7928, 79.1365,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 890, 30, "10:00 AM - 1:00 PM, 1:30 PM - 5:30 PM (Closed Wednesdays)", "Year-round", 1.5,
        ["Ancient Library", "Palm Leaf Manuscripts", "Serfoji Collection", "Medieval Books"], 0
    ),
    (
        "Thanjavur", "historical", "Sangeetha Mahal (Hall of Music)",
        "An acoustically perfect music auditorium built during the 16th century by Sevappa Nayak inside the palace complex, featuring vaulted ceilings and cooling water pools.",
        "Palace Complex, Thanjavur, Tamil Nadu",
        10.7920, 79.1360,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.6, 610, 20, "9:00 AM - 5:30 PM", "Year-round", 1.5,
        ["Acoustic Marvel", "Hall of Music", "Palace Complex", "Carnatic Music"], 0
    ),
    (
        "Thanjavur", "nature", "Sivaganga Park & Chola Moat Gardens",
        "A recreational garden dating back to Raja Serfoji, located adjacent to the Big Temple moat with tranquil motorboating, aviary, and flower gardens.",
        "Near Big Temple, Thanjavur, Tamil Nadu",
        10.7850, 79.1300,
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        ["https://images.unsplash.com/photo-1448375240586-882707db888b?w=800"],
        4.5, 730, 20, "9:00 AM - 6:00 PM", "All Seasons", 0.8,
        ["Chola Moat", "Lakeside Boating", "Family Park", "Historic Serfoji"], 0
    ),
    (
        "Thanjavur", "museum", "Royal Palace Art Gallery & Bronze Sculptures",
        "Magnificent gallery situated in the Palace Durbar Hall exhibiting priceless Chola-era bronze icons including Nataraja, Parvathi, and Stone statues of Chola Kings.",
        "Palace Complex, East Main Street, Thanjavur",
        10.7930, 79.1375,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 920, 50, "9:00 AM - 6:00 PM", "Year-round", 1.6,
        ["Chola Bronzes", "Nataraja Icons", "Durbar Hall", "King Raja Raja Statue"], 1
    ),
    (
        "Thanjavur", "historical", "Schwartz Church & British Memorial",
        "Built in 1779 by Danish missionary Rev. Christian Friedrich Schwartz with the patronage of Raja Serfoji II. Features a touchingly sculpted marble relief by John Flaxman.",
        "Near Shiva Ganga Tank, Thanjavur",
        10.7840, 79.1310,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.6, 420, 0, "8:00 AM - 5:30 PM", "Year-round", 0.9,
        ["18th Century", "Danish Church", "Raja Serfoji", "Marble Relief"], 0
    ),
    (
        "Thanjavur", "historical", "Grand Anicut (Kallanai Dam)",
        "The world's fourth-oldest water diversion dam, built in the 2nd century AD by King Karikala Chola across the Kaveri. A living tribute to ancient Tamil hydraulic engineering.",
        "Kallanai, Kaveri-Kollidam Confluence, Thanjavur District",
        10.8350, 78.8180,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 1450, 10, "8:00 AM - 6:30 PM", "August to February", 38.0,
        ["2nd Century Dam", "Karikala Chola", "Ancient Engineering", "Kaveri River"], 1
    ),
    (
        "Thanjavur", "temple", "Punnainallur Mariamman Temple",
        "A revered 17th-century temple established by the Maratha King Venkoji Maharaja, famed for the swayambhu anthill deity that transforms with natural moisture.",
        "Punnainallur, Thanjavur District",
        10.7880, 79.1850,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.7, 790, 0, "6:00 AM - 1:00 PM, 4:00 PM - 9:00 PM", "Year-round", 5.5,
        ["Maratha Deity", "Healing Temple", "Spiritual", "Chola Region"], 0
    ),
    (
        "Thanjavur", "shopping", "Thanjavur Art & Doll Weaving Village",
        "Traditional artisan quarters where generations of craftsmen create the world-famous dancing bobblehead dolls (Thanjavur Gundu Bommai) and 22-carat gold foil Tanjore paintings.",
        "West Main Street & Manojappa Street, Thanjavur",
        10.7890, 79.1330,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.8, 860, 0, "9:30 AM - 8:30 PM", "Year-round", 1.2,
        ["Tanjore Paintings", "Bobblehead Dolls", "Gold Foil Art", "Craft Workshops"], 1
    ),
    (
        "Thanjavur", "temple", "Bangaru Kamakshi Amman Temple",
        "Historic shrine housing the famed Golden Kamakshi deity brought from Kanchipuram to Thanjavur during the 18th-century Carnatic wars for divine safekeeping.",
        "West Main Street, Thanjavur",
        10.7870, 79.1340,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.7, 490, 0, "6:00 AM - 12:00 PM, 4:30 PM - 8:30 PM", "Year-round", 1.1,
        ["Golden Kamakshi", "Sacred Shrine", "Carnatic History", "Spiritual"], 0
    ),
    (
        "Thanjavur", "temple", "Thiruvalanjuli Sweta Vinayagar Temple",
        "Ancient temple near Kumbakonam famed for its white seashell-sculpted Vinayagar idol, intricate stone lattice windows, and towering Chola architecture.",
        "Thiruvalanjuli, Thanjavur-Kumbakonam Road",
        10.9320, 79.3320,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.7, 560, 0, "6:30 AM - 12:30 PM, 4:00 PM - 8:30 PM", "Year-round", 24.0,
        ["White Ganesha", "Stone Lattice", "Chola Pillars", "Sacred Sanctum"], 0
    ),

    # ==========================================
    # 11. MYSURU (12 Places)
    # ==========================================
    (
        "Mysuru", "historical", "Mysore Royal Palace (Amba Vilas)",
        "The grand Indo-Saracenic royal seat of the Wadiyar dynasty. Boasts a Golden Throne, stained-glass peacock ceilings, and 97,000 bulbs that illuminate on Sunday evenings.",
        "Sayyaji Rao Rd, Agrahara, Chamrajpura, Mysuru",
        12.3052, 76.6552,
        "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800",
        ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800"],
        4.9, 2890, 100, "10:00 AM - 5:30 PM (Illumination on Sundays 7:00 PM - 7:45 PM)", "October to March", 1.0,
        ["Royal Palace", "Illumination", "Wadiyar Dynasty", "Indo-Saracenic"], 1
    ),
    (
        "Mysuru", "temple", "Chamundeshwari Temple & Chamundi Hill",
        "Perched at 3,300 feet atop Chamundi Hill, this sacred 1,000-year-old temple honors Goddess Chamundeshwari, with a monumental 16-foot monolithic Nandi bull.",
        "Chamundi Hill, Mysuru, Karnataka",
        12.2725, 76.6710,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 1780, 0, "7:30 AM - 2:00 PM, 3:30 PM - 6:00 PM, 7:30 PM - 9:00 PM", "Year-round", 12.0,
        ["Hilltop Temple", "Monolithic Nandi", "Chamundi Hill", "Mysore Vista"], 1
    ),
    (
        "Mysuru", "nature", "Brindavan Gardens & Musical Fountain",
        "Sprawling terraced Mughal gardens laid out behind the Krishnaraja Sagara Dam, featuring illuminated dancing fountains synchronized to classical and popular music.",
        "KRS Dam, Mandya / Mysuru District, Karnataka",
        12.4230, 76.5730,
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"],
        4.7, 1920, 50, "6:30 AM - 9:00 PM (Musical Fountain 6:30 PM - 8:00 PM)", "All Seasons", 18.0,
        ["Terraced Gardens", "Musical Fountain", "KRS Dam", "Evening Lights"], 1
    ),
    (
        "Mysuru", "nature", "Sri Chamarajendra Zoological Gardens (Mysore Zoo)",
        "Established in 1892 by Maharaja Chamaraja Wadiyar over 157 acres, one of the oldest and best-kept zoos in India, home to giraffes, elephants, gorillas, and white tigers.",
        "Zoo Main Rd, Indira Nagar, Ittige Gudu, Mysuru",
        12.3023, 76.6644,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.8, 2150, 100, "8:30 AM - 5:30 PM (Closed Tuesdays)", "October to March", 2.5,
        ["Heritage Zoo", "Giraffes", "White Tigers", "Karanji Boundary"], 1
    ),
    (
        "Mysuru", "historical", "St. Philomena's Neo-Gothic Cathedral",
        "A monumental neo-Gothic Catholic cathedral built in 1936 with 175-foot twin spires modeled after Germany's Cologne Cathedral, housing third-century relics of St. Philomena.",
        "Lashkar Mohalla, Mysuru, Karnataka",
        12.3210, 76.6580,
        "https://images.unsplash.com/photo-1548625361-195feee13d80?w=800",
        ["https://images.unsplash.com/photo-1548625361-195feee13d80?w=800"],
        4.7, 1250, 0, "5:00 AM - 6:00 PM", "Year-round", 2.0,
        ["Neo-Gothic", "Twin Spires", "Cologne Replica", "Cathedral Crypt"], 0
    ),
    (
        "Mysuru", "museum", "Jaganmohan Palace & Art Gallery",
        "Built in 1861 as an alternate royal residence, this palace now houses the Sri Jayachamarajendra Art Gallery with original masterpieces by Raja Ravi Varma and musical clocks.",
        "Deshika Road, Subbarayanakere, Mysuru",
        12.3080, 76.6500,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 980, 75, "8:30 AM - 5:30 PM", "Year-round", 1.2,
        ["Raja Ravi Varma", "Royal Art Gallery", "French Musical Clock", "Oil Paintings"], 1
    ),
    (
        "Mysuru", "nature", "Karanji Lake & Walk-Through Aviary",
        "Sprawling 90-acre nature park boasting India's largest walk-through aviary, butterfly park, and serene lake waters surrounded by migrating pelicans and painted storks.",
        "Siddartha Layout, Mysuru",
        12.3020, 76.6740,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 840, 50, "8:30 AM - 5:30 PM (Closed Tuesdays)", "October to March", 3.0,
        ["Walk-through Aviary", "Butterfly Enclave", "Boating Lake", "Pelicans"], 0
    ),
    (
        "Mysuru", "museum", "Railway Museum Mysuru",
        "India's second oldest railway heritage museum, preserving the royal 1899 Mysore Maharani salon coach, vintage Austin rail cars, and steam locomotives.",
        "KRS Road, Medar Block, Yadavagiri, Mysuru",
        12.3160, 76.6430,
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800",
        ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"],
        4.7, 720, 50, "10:00 AM - 5:30 PM (Closed Mondays)", "Year-round", 2.8,
        ["Vintage Locomotives", "Royal Train Saloon", "Toy Train Ride", "Railway History"], 0
    ),
    (
        "Mysuru", "shopping", "Devaraja 130-Year-Old Royal Market",
        "A sensory extravaganza operating since the reign of Chamaraja Wadiyar IX, packed with fresh mounds of fragrant marigolds, Mysore betel leaves, pure sandalwood, and incense.",
        "Sayyaji Rao Road, Mysuru",
        12.3090, 76.6520,
        "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800",
        ["https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"],
        4.8, 1420, 0, "6:30 AM - 9:30 PM", "All Seasons", 0.8,
        ["Sandalwood", "Mysore Pak", "Flower Market", "Heritage Bazaar"], 1
    ),
    (
        "Mysuru", "adventure", "Ranganathittu Bird Sanctuary",
        "The largest bird sanctuary in Karnataka, comprising six tranquil islets on Kaveri River. Guided boat rides pass marsh crocodiles, spoonbills, and thousands of nesting herons.",
        "Srirangapatna, Mandya / Mysuru Highway",
        12.4240, 76.6940,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.8, 1550, 80, "8:30 AM - 5:30 PM", "November to June", 16.0,
        ["Kaveri River Boat Safari", "Crocodile Spotting", "Migratory Birds", "Islet Sanctuary"], 1
    ),
    (
        "Mysuru", "temple", "Venugopala Swamy Temple (KRS Backwaters)",
        "Stunning 12th-century Hoysala temple originally submerged under the KRS reservoir for decades, painstakingly restored block-by-block on the picturesque water edge of Hosa Kannambadi.",
        "Hosa Kannambadi, KRS Backwaters, Mysuru",
        12.4410, 76.5480,
        "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
        ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800"],
        4.8, 860, 0, "9:00 AM - 6:00 PM", "Year-round", 20.0,
        ["Hoysala Architecture", "Backwater Temple", "Sunset Vista", "Stone Carvings"], 0
    ),
    (
        "Mysuru", "entertainment", "GRS Fantasy Theme & Water Park",
        "Premier amusement water park in Metagalli featuring the Columbia pendulum swing, Amazon thrill rapids, aqua danceloop, and children's splash pool.",
        "KRS Road, Metagalli, Mysuru",
        12.3550, 76.6250,
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800",
        ["https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800"],
        4.6, 990, 850, "10:30 AM - 6:00 PM", "All Seasons", 8.0,
        ["Water Park", "Thrill Rides", "Wave Pool", "Family Entertainment"], 0
    ),

    # ==========================================
    # 12. MUNNAR (12 Places)
    # ==========================================
    (
        "Munnar", "nature", "Eravikulam National Park & Nilgiri Tahr",
        "Kerala's first national park nestled along the crest of Western Ghats, sheltering the largest surviving wild population of endangered Nilgiri Tahr against rolling rolling Shola grass.",
        "Kannandevan Hills, Munnar, Kerala",
        10.1500, 77.0600,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.9, 2150, 200, "7:30 AM - 4:00 PM (Closed Feb-March for calving)", "September to May", 8.5,
        ["Nilgiri Tahr", "Anamudi Views", "Shola Grasslands", "Safari Bus"], 1
    ),
    (
        "Munnar", "nature", "Mattupetty Dam & Speedboating",
        "A concrete gravity dam built in 1953 surrounded by tea slopes, renowned for speedboating across deep mountain waters and wild elephant herds visiting the banks.",
        "Mattupetty, Munnar, Kerala",
        10.1050, 77.1250,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1680, 50, "9:30 AM - 5:00 PM", "October to May", 13.0,
        ["Speedboating", "Wild Elephants", "Concrete Dam", "Tea Hills"], 1
    ),
    (
        "Munnar", "museum", "Tata Tea Museum & Nallathanni Estate",
        "Preserving century-old tea machinery, the original 1905 rotorvane roller, and manual tea plucking demonstrations with curated tea-tasting sessions.",
        "KDHP House, Nallathanni Estate, Munnar",
        10.0890, 77.0540,
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800",
        ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
        4.7, 1220, 125, "9:00 AM - 5:00 PM (Closed Mondays)", "Year-round", 1.8,
        ["Tea Processing", "Tea Tasting", "Vintage Machinery", "Heritage Estate"], 0
    ),
    (
        "Munnar", "adventure", "Top Station & Cloud Valley Panorama",
        "The highest point on Munnar-Kodaikanal road (6,170 ft) on the Kerala-Tamil Nadu border, offering breathtaking vistas of Kurinjimala sanctuary and the Western Ghats.",
        "Top Station, Kerala-Tamil Nadu Border",
        10.1240, 77.2430,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 1420, 25, "6:00 AM - 6:00 PM", "October to May", 32.0,
        ["Sea of Clouds", "Highest Outlook", "Kurinjimala", "Border Vistas"], 1
    ),
    (
        "Munnar", "nature", "Attukad Waterfalls & Forest Trail",
        "A roaring mountain waterfall set in a secluded forest gorge between Munnar and Pallivasal, surrounded by jungle greenery and wooden footbridges.",
        "Attukad Falls Rd, Pallivasal, Munnar",
        10.0520, 77.0450,
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800",
        ["https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800"],
        4.7, 980, 0, "Open 24/7", "June to January", 9.0,
        ["Gorge Waterfall", "Forest Trek", "Roaring Falls", "Cardamom Hills"], 0
    ),
    (
        "Munnar", "nature", "Kundala Lake & Arch Dam Boating",
        "Asia's first arched dam framed by silent pine and eucalyptus woods, where Kashmiri-style Shikara boat cruises and pedal boats glide over shimmering waters.",
        "Kundala Valley, Munnar-Top Station Rd",
        10.1180, 77.1680,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 1140, 50, "9:00 AM - 5:00 PM", "October to May", 20.0,
        ["Arch Dam", "Shikara Boats", "Cherry Blossoms", "Pine Woods"], 1
    ),
    (
        "Munnar", "adventure", "Anamudi Peak Viewpoint",
        "Rising to 8,842 feet, the 'Everest of South India'. While the summit is protected for wildlife, viewpoint decks offer stunning panoramas of the colossal granite peak.",
        "Eravikulam National Park, Munnar",
        10.1690, 77.0640,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.9, 1310, 0, "7:30 AM - 4:00 PM", "October to May", 12.0,
        ["Highest South Peak", "Granite Giant", "Rare Flora", "Western Ghats Apex"], 1
    ),
    (
        "Munnar", "nature", "Pothamedu Viewpoint",
        "Panoramic mountain cliff vantage offering dramatic sweeps of verdant tea, coffee, and cardamom plantations blanketed in shifting blankets of fog.",
        "Pothamedu, Munnar",
        10.0580, 77.0510,
        "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800",
        ["https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800"],
        4.7, 860, 0, "6:00 AM - 7:00 PM", "All Seasons", 4.5,
        ["Cardamom Slopes", "Sunset Horizon", "Tea Valleys", "Misty Views"], 0
    ),
    (
        "Munnar", "nature", "Blossom International Eco Park",
        "A peaceful 16-acre eco-adventure park near the Muthirapuzha River with rare exotic flowers, treehouses, roller skating rinks, ziplining, and cycling trails.",
        "Aluva - Munnar Road, Near Headworks Dam",
        10.0710, 77.0590,
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800"],
        4.6, 750, 40, "9:00 AM - 7:00 PM", "All Seasons", 2.5,
        ["Eco Park", "Treehouses", "Ziplining", "Riverbank Walks"], 0
    ),
    (
        "Munnar", "adventure", "Lockhart Gap & Chokramudi Trek",
        "A spectacular natural rock cleft resembling a heart shape between two cliffs. Renowned for mist-filled sunset trekking trails and spice plantation views.",
        "Lockhart Gap, Munnar-Thekkady Road",
        10.0400, 77.1000,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 680, 0, "6:00 AM - 6:30 PM", "September to April", 12.0,
        ["Rock Cleft", "Chokramudi Trek", "Bison Spotting", "Sunset Point"], 0
    ),
    (
        "Munnar", "adventure", "Kolukkumalai Highest Tea Estate",
        "The highest organic orthodox tea estate in the world at 7,900 feet, approached via thrilling 4x4 off-road jeep climbs above endless cloud oceans.",
        "Kottagudi / Kolukkumalai Hills, Near Munnar",
        10.0820, 77.2280,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.9, 1890, 150, "Jeep safari departs 4:30 AM for sunrise", "October to May", 35.0,
        ["World Highest Tea", "7900ft Elevation", "Off-Road 4x4", "Cloud Sunrise"], 1
    ),
    (
        "Munnar", "adventure", "Chinnar Wildlife Sanctuary & Dolmens",
        "A rain-shadow deciduous wildlife park home to the vulnerable grizzled giant squirrel, star tortoises, and prehistoric Megalithic burial dolmens.",
        "Munnar - Udumalpet Road, Marayoor Range",
        10.3150, 77.1950,
        "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800",
        ["https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800"],
        4.7, 720, 100, "7:00 AM - 5:00 PM", "October to April", 48.0,
        ["Giant Squirrel", "Megalithic Dolmens", "Sandalwood Forests", "Safari Trek"], 0
    ),

    # ==========================================
    # RURAL & VILLAGE TOURISM SPOTS (24 Places Across 12 Destinations)
    # ==========================================
    # 1. COIMBATORE
    (
        "Coimbatore", "rural", "Pollachi Coconut Groves & Village Farmstay",
        "An idyllic countryside paradise famous for endless green coconut canopies, tranquil irrigation canals, traditional bullock-cart rides, jaggery processing sheds, and organic agro-farms.",
        "Anamalai Foothills, Pollachi Countryside, Coimbatore District",
        10.6580, 77.0080,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.8, 890, 0, "6:00 AM - 6:30 PM", "All Seasons", 40.0,
        ["Coconut Canals", "Village Farmstay", "Bullock Cart", "Agro Tourism"], 1
    ),
    (
        "Coimbatore", "rural", "Sethumadai Village & Herbal Agrotour Trails",
        "A peaceful farming hamlet at the base of the Western Ghats lined with fragrant nutmeg plantations, cocoa groves, betel-vine trellises, and stream-fed village pathways.",
        "Sethumadai Village, Anaimalai Taluk, Coimbatore District",
        10.4520, 76.9210,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 540, 0, "7:00 AM - 6:00 PM", "October to March", 48.0,
        ["Herbal Farms", "Nutmeg Groves", "Rural Hamlets", "Country Trails"], 0
    ),

    # 2. CHENNAI
    (
        "Chennai", "rural", "Muttukadu & Kovalam Coastal Fishing Village",
        "A serene coastal fisherman hamlet nestled between backwaters and sea, offering catamaran boat rides with local fishermen, palm-thatched fish drying yards, and village seafood grills.",
        "Kovalam Coastal Village, ECR, Chennai South",
        12.7915, 80.2520,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.6, 1150, 0, "6:00 AM - 7:00 PM", "November to February", 32.0,
        ["Fishing Village", "Catamaran Ride", "Coastal Life", "Rural Crafts"], 1
    ),
    (
        "Chennai", "rural", "Kanchipuram Silk Weavers' Heritage Colony",
        "A traditional artisanal weaver settlement where generations of master handloom artisans spin mulberry silk and pure gold zari on ancestral wooden pit-looms in their ancestral village homes.",
        "Pillaiyarpalayam Weavers Quarter, Kanchipuram Outer",
        12.8340, 79.7030,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 1420, 0, "9:00 AM - 6:00 PM", "All Seasons", 55.0,
        ["Handloom Weaving", "Artisan Heritage", "Pure Silk Zari", "Cottage Craft"], 1
    ),

    # 3. OOTY
    (
        "Ooty", "rural", "Toda Tribal Hamlet & Sacred Pastoral Reserve",
        "An authentic high-altitude settlement of the indigenous Toda community featuring sacred barrel-vaulted thatch huts, conical temples, embroidered poothkuli shawls, and grazing sacred buffaloes.",
        "Muthunadu Mund, Wenlock Downs, Nilgiris",
        11.4320, 76.6710,
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
        ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"],
        4.9, 1380, 20, "9:00 AM - 5:30 PM", "October to May", 8.5,
        ["Toda Tribe", "Barrel Huts", "Indigenous Culture", "Nilgiri Sholas"], 1
    ),
    (
        "Ooty", "rural", "Manjoor Valley & Countryside Tea Hamlet",
        "A peaceful rural mountain village perched high on the southern slopes of the Nilgiris, surrounded by terraced carrot patches, artisanal mini tea factories, and silent cloud valleys.",
        "Manjoor Village, Kundah Taluk, Nilgiris",
        11.2330, 76.6430,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 620, 0, "Open 24 Hours", "September to April", 29.0,
        ["Mountain Hamlet", "Terraced Crops", "Quiet Valleys", "Rural Serenity"], 0
    ),

    # 4. MADURAI
    (
        "Madurai", "rural", "Vilachery Terracotta & Clay Pottery Village",
        "A celebrated craft village where skilled potters shape and paint vibrant clay terracotta figurines, temple vahanas, festive dolls, and earthenware using traditional wooden kick-wheels.",
        "Vilachery Village, Pasumalai Outer, Madurai District",
        9.8820, 78.0810,
        "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800",
        ["https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800"],
        4.8, 1650, 0, "8:00 AM - 6:30 PM", "October to March", 9.0,
        ["Pottery Village", "Terracotta Craft", "Clay Figurines", "Artisan Workshops"], 1
    ),
    (
        "Madurai", "rural", "Keeladi Ancient Vaigai Agrarian Village",
        "A tranquil riverside village on the banks of Vaigai river, internationally famed for archaeological discoveries unearthing an advanced 2,600-year-old Sangam urban civilization amidst coconut groves.",
        "Keeladi Village, Sivaganga Border, Near Madurai",
        9.8620, 78.1880,
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
        ["https://images.unsplash.com/photo-1548013146-72479768bada?w=800"],
        4.8, 2100, 15, "9:00 AM - 5:30 PM", "October to March", 14.0,
        ["Ancient Excavation", "Sangam Heritage", "Paddy Groves", "River Village"], 1
    ),

    # 5. SALEM
    (
        "Salem", "rural", "Mallasamudram Handloom Weaving Village",
        "A quaint rural textile village famed for organic cotton handloom dhotis, cotton sarees, and rhythmic pit-looms operated in traditional village courtyard homes amidst sugarcane fields.",
        "Mallasamudram Rural Block, Namakkal-Salem Border",
        11.4820, 77.9620,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.7, 580, 0, "8:00 AM - 6:00 PM", "Year-round", 28.0,
        ["Cotton Weaving", "Handloom Heritage", "Sugarcane Fields", "Rural Crafts"], 0
    ),
    (
        "Salem", "rural", "Poiman Karadu & Country Mango Groves",
        "A picturesque rural foothill hamlet surrounded by expansive mango orchards, jaggery crushers, and ancient folklore lookouts where rural shepherds graze sheep beneath granite crags.",
        "Poiman Karadu Foothills, Salem Outer",
        11.5830, 78.1180,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 740, 0, "6:00 AM - 6:00 PM", "March to July", 12.0,
        ["Mango Orchards", "Pastoral Hamlet", "Granite Foothills", "Country Trails"], 0
    ),

    # 6. BENGALURU
    (
        "Bengaluru", "rural", "Janapada Loka Folk Arts & Village Heritage",
        "A sprawling 15-acre rural lifestyle and folk museum campus featuring traditional village huts, oil extractors, bullock carts, wooden puppets, folk dance arenas, and mud-architecture houses.",
        "Bangalore-Mysore Highway, Ramanagara",
        12.7210, 77.2910,
        "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
        ["https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800"],
        4.8, 3100, 50, "9:00 AM - 5:30 PM (Closed Tuesday)", "All Seasons", 45.0,
        ["Folk Village", "Rural Artifacts", "Mud Architecture", "Cultural Heritage"], 1
    ),
    (
        "Bengaluru", "rural", "Nrityagram Dance Village & Hesaraghatta Grasslands",
        "A visionary eco-rural artists community built using raw mud and red earth bricks, surrounded by rural organic farms, dairy pastures, and tranquil Hesaraghatta freshwater lake.",
        "Hesaraghatta Village, Bengaluru North",
        13.1610, 77.4640,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.7, 1950, 100, "10:00 AM - 2:00 PM (Closed Mon & Tue)", "All Seasons", 30.0,
        ["Earth Architecture", "Dance Gurukul", "Organic Farming", "Grasslands"], 1
    ),

    # 7. KODAIKANAL
    (
        "Kodaikanal", "rural", "Mannavanur Sheep Farm & Pastoral Meadows",
        "A pristine alpine village hamlet known for rolling emerald meadows, the central sheep breeding research farm, grazing rabbit warrens, carrot washing canals, and a quiet lake.",
        "Mannavanur Village, Kodaikanal Hills",
        10.2980, 77.3480,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.8, 2600, 20, "9:00 AM - 5:00 PM", "October to May", 32.0,
        ["Pastoral Meadows", "Sheep Farm", "Carrot Terraces", "Alpine Hamlet"], 1
    ),
    (
        "Kodaikanal", "rural", "Poombarai Step-Farming Amphitheatre Village",
        "A breathtaking mountain village cascading along steep hill slopes with colorful stepped houses, multi-tiered garlic and cabbage terraces, and the ancient Kuzhanthai Velappar Temple.",
        "Poombarai Village, Kodaikanal Taluk",
        10.2580, 77.4080,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.9, 3200, 0, "Open Daily", "Year-round", 18.0,
        ["Step Terraces", "Garlic Farming", "Hilltop Hamlet", "Valley Panorama"], 1
    ),

    # 8. PONDICHERRY
    (
        "Pondicherry", "rural", "Bahour Ancient Paddy Village & Tank",
        "Known as the 'Rice Bowl of Puducherry', an agrarian heritage village famed for 10th-century Chola irrigation reservoirs, sprawling emerald paddy fields, and serene village temples.",
        "Bahour Village, Puducherry South",
        11.8020, 79.7480,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.7, 850, 0, "Open 24 Hours", "November to February", 18.0,
        ["Rice Bowl", "Chola Water Tanks", "Paddy Fields", "Rural Heritage"], 0
    ),
    (
        "Pondicherry", "rural", "Poornankuppam River Village & Mangrove Trails",
        "A scenic coastal village settled where backwater rivers meet the Bay of Bengal, surrounded by coconut groves, mangrove estuaries, traditional coracle boats, and fishermen shacks.",
        "Poornankuppam Village, Near Ariyankuppam",
        11.8720, 79.8080,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.6, 920, 0, "6:00 AM - 6:30 PM", "October to March", 9.5,
        ["River Hamlet", "Mangroves", "Coconut Groves", "Fishing Country"], 0
    ),

    # 9. KANYAKUMARI
    (
        "Kanyakumari", "rural", "Muttom Seaside Fishing Village & Rock Coast",
        "A charming coastal village famed for its hundred-year-old lighthouse perched on rugged granite rocks, colorful wooden fishing catamarans, dry fish racks, and dramatic sea waves.",
        "Muttom Coastal Village, Kanyakumari District",
        8.1250, 77.3180,
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"],
        4.7, 1420, 10, "6:00 AM - 6:30 PM", "October to March", 28.0,
        ["Coastal Village", "Lighthouse", "Rocky Shore", "Fishermen Catamarans"], 1
    ),
    (
        "Kanyakumari", "rural", "Pechiparai Countryside & Tribal Plantations",
        "A lush rural foothill village nestled beside the Pechiparai reservoir, celebrated for sprawling rubber plantations, wild forest honey gatherers, clove groves, and bamboo thickets.",
        "Pechiparai Village, Western Ghats Foothills",
        8.4520, 77.2910,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.6, 680, 0, "7:00 AM - 5:30 PM", "September to March", 42.0,
        ["Rubber Plantations", "Forest Village", "Reservoir Views", "Tribal Honey"], 0
    ),

    # 10. THANJAVUR
    (
        "Thanjavur", "rural", "Swamimalai Bronze Casting Artisan Village",
        "A legendary heritage artisan hamlet where hereditary sthapatis craft world-famous lost-wax process bronze sculptures using age-old formulas codified in ancient Shilpa Shastras.",
        "Swamimalai Village, Near Kumbakonam, Thanjavur District",
        10.9540, 79.3280,
        "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800",
        ["https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800"],
        4.9, 1850, 0, "9:00 AM - 6:00 PM", "All Seasons", 32.0,
        ["Bronze Casting", "Lost Wax Art", "Master Artisans", "Heritage Village"], 1
    ),
    (
        "Thanjavur", "rural", "Thiruvaiyaru Cauvery Agrarian Hamlet",
        "A peaceful rural hamlet located on the fertile delta of the Cauvery river, surrounded by lush paddy crops, fragrant plantain groves, and the sacred samadhi of Saint Tyagaraja.",
        "Thiruvaiyaru Village, Thanjavur District",
        10.8840, 79.1030,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.8, 1220, 0, "6:00 AM - 8:00 PM", "October to March", 13.0,
        ["Cauvery Delta", "Carnatic Heritage", "Banana Plantations", "Delta Paddy"], 1
    ),

    # 11. MYSURU
    (
        "Mysuru", "rural", "Melukote Heritage Village & Kalyani Tank",
        "A sacred rural temple township crowning granite hills, famed for its ancient stepped temple tank (Kalyani), traditional handloom dhotis, Iyengar cuisine, and Sanskrit learning academies.",
        "Melukote Town, Pandavapura Taluk, Near Mysuru",
        12.6660, 76.6520,
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
        ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
        4.8, 2300, 0, "6:30 AM - 8:00 PM", "October to March", 48.0,
        ["Stepped Kalyani Tank", "Rural Temple Town", "Sanskrit Academies", "Handloom Weavers"], 1
    ),
    (
        "Mysuru", "rural", "BR Hills Soliga Tribal Forest Settlement",
        "An indigenous hill hamlet in Biligirirangana Hills where the Soliga tribal community maintains sustainable wild honey collecting, organic shade-grown coffee farming, and sacred champak trees.",
        "Biligiriranganatha Swamy Range, Chamarajanagar",
        11.9950, 77.1400,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.7, 1120, 50, "6:00 AM - 6:00 PM", "September to April", 75.0,
        ["Tribal Settlement", "Wild Honey", "Coffee Plantations", "Sacred Champak"], 0
    ),

    # 12. MUNNAR
    (
        "Munnar", "rural", "Kanthalloor Fruit Orchards & Village Step-Farms",
        "A fairytale rural village nestled in a misty rain-shadow valley, celebrated for step-cultivated orchards of apples, plums, oranges, passion fruit, strawberries, and sweet sugarcane jaggery.",
        "Kanthalloor Village, Idukki District",
        10.2240, 77.1980,
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800"],
        4.9, 2150, 0, "Open Daily", "October to May", 45.0,
        ["Apple Orchards", "Step Farming", "Fruit Village", "Cool Mist"], 1
    ),
    (
        "Munnar", "rural", "Marayoor Sugarcane Jaggery & Sandalwood Village",
        "A scenic pastoral hamlet renowned for naturally growing wild sandalwood forests, ancient Neolithic dolmens, and traditional open-hearth sugarcane processing sheds making famed Marayoor Sharkara.",
        "Marayoor Countryside, Munnar-Udumalpet Road",
        10.2810, 77.1620,
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800"],
        4.8, 1850, 0, "Open Daily", "Year-round", 40.0,
        ["Sandalwood Groves", "Organic Jaggery", "Prehistoric Dolmens", "Agrarian Life"], 1
    )
]

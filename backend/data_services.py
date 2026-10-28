"""
CityMate - Essential Services Dataset
22 Curated Services for each of the 12 Cities (264 Total Services)
Including:
- 3 Distinct Breakfast / Morning Tiffin Restaurants
- 3 Distinct Lunch / Traditional Thali & Meal Restaurants
- 3 Distinct Dinner / Fine Dining & Rooftop Restaurants
- 3 Stays (Budget, Moderate, Luxury)
- 2-3 Emergency Multi-Specialty Hospitals
- 1-2 Police & Tourist Safety Stations
- 2 24x7 ATMs & Forex Counters
- 2 Petrol Bunks & EV Superchargers
- 2 Traditional Markets & Bazaars
- 1-2 Rentals & Local Transit Hubs

Format per service tuple:
(city_name, linked_place_name, service_type, name, address, lat, lng, rating, phone, opening_status, image_url, distance_km, price_level)
"""

SERVICES_LIST = [
    # ==========================================
    # 1. COIMBATORE SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Coimbatore", None, "restaurant", "Sree Annapoorna Iconic Ghee Roast & Filter Kaapi (Breakfast Special)", "75 East Arokiasamy Rd, RS Puram, Coimbatore", 11.0110, 76.9520, 4.9, "+91 422 254 7722", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.2, "$$"),
    ("Coimbatore", None, "restaurant", "Sri Krishna Sweets & Woodlands Morning Tiffin House", "DB Road, RS Puram, Coimbatore", 11.0120, 76.9510, 4.8, "+91 422 254 1234", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.0, "$"),
    ("Coimbatore", "Adiyogi Shiva & Isha Yoga Center", "restaurant", "Aroma Pepper Organic Sattvic Cafe & Herbal Tiffin", "Near Dhyanalinga Entry, Velliangiri Foothills", 10.9745, 76.7412, 4.7, "+91 94432 10987", "Breakfast (07:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.4, "$$"),
    # Lunch
    ("Coimbatore", None, "restaurant", "Annapoorna Gowrishankar Classic South Indian Meals & Thali (Lunch Special)", "Cross-Cut Road, Gandhipuram, Coimbatore", 11.0180, 76.9650, 4.9, "+91 422 223 1234", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.5, "$$"),
    ("Coimbatore", None, "restaurant", "Junior Kuppanna Kongu Traditional Meals & Mutton Biryani (Lunch Special)", "Geetha Hall Road, Ram Nagar, Coimbatore", 11.0145, 76.9680, 4.8, "+91 422 223 5566", "Lunch (12:30 PM - 04:00 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 1.8, "$$"),
    ("Coimbatore", None, "restaurant", "Hari Bhavanam Authentic Chettinad & Banana Leaf Feast (Lunch Special)", "Bharathi Colony, Peelamedu, Coimbatore", 11.0260, 77.0010, 4.8, "+91 422 256 0999", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 3.0, "$$"),
    # Dinner
    ("Coimbatore", None, "restaurant", "Poornam Heritage Rooftop Grill & Dinner Restaurant", "Race Course Promenade, Coimbatore", 11.0065, 76.9715, 4.8, "+91 422 224 1414", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.0, "$$$"),
    ("Coimbatore", None, "restaurant", "The Pavilion at The Residency Towers (Fine Dining & Candlelight)", "Avinashi Road, Coimbatore", 11.0150, 76.9800, 4.9, "+91 422 224 1414", "Dinner (07:30 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 2.5, "$$$$"),
    ("Coimbatore", None, "restaurant", "Bird On Tree Ambient Garden Dinner & Continental Bistro", "Race Course Road, Gopalapuram, Coimbatore", 11.0040, 76.9750, 4.7, "+91 422 436 4444", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.2, "$$$"),
    # Hotels (Budget, Moderate, Luxury)
    ("Coimbatore", None, "hotel", "Zostel / Central Backpacker Inn Coimbatore (Budget Stay)", "Near Railway Station, Geetha Hall Rd, Coimbatore", 11.0010, 76.9660, 4.6, "+91 422 230 1122", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.8, "$"),
    ("Coimbatore", None, "hotel", "The Orbis Hotel & Business Suites (Comfort Stay)", "Avinashi Road, Peelamedu, Coimbatore", 11.0310, 77.0120, 4.7, "+91 422 455 5555", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.0, "$$"),
    ("Coimbatore", "Adiyogi Shiva & Isha Yoga Center", "hotel", "Radisson Blu / Poornam Eco Resort (Luxury Stay)", "Avinashi Road / Velliangiri Foothills, Coimbatore", 11.0065, 76.9715, 4.9, "+91 422 224 1414", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 2.5, "$$$$"),
    # Hospitals (24x7 Emergency)
    ("Coimbatore", None, "hospital", "Kovai Medical Center & Hospital (KMCH 24x7 Quaternary Trauma)", "Avinashi Road, Civil Aerodrome Post, Coimbatore", 11.0425, 77.0390, 4.9, "+91 422 432 3800", "24x7 Emergency & Trauma", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 4.5, "$$$"),
    ("Coimbatore", None, "hospital", "Ganga Hospital & Trauma Orthopaedic Center (24 Hours)", "313 Mettupalayam Road, Ram Nagar, Coimbatore", 11.0205, 76.9535, 4.9, "+91 422 248 5000", "24x7 Critical Care", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 2.1, "$$$"),
    # Police & Safety
    ("Coimbatore", None, "police", "Coimbatore City Central Police Station & Tourist Assistance Unit", "Old Post Office Road, Railway Station Junction, Coimbatore", 10.9980, 76.9640, 4.8, "100 / +91 422 230 0100", "24x7 Tourist Helpline", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 1.0, "$"),
    # ATMs
    ("Coimbatore", None, "atm", "State Bank of India 24x7 Cash Deposit & Forex Hub", "Avanashi Road, Near Collectorate, Coimbatore", 11.0040, 76.9690, 4.6, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.5, "$"),
    ("Coimbatore", None, "atm", "HDFC Bank 24/7 ATM & International Card Kiosk", "DB Road, RS Puram, Coimbatore", 11.0115, 76.9530, 4.5, "1800 202 6161", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 1.1, "$"),
    # Petrol & EV
    ("Coimbatore", None, "petrol_bunk", "Indian Oil Eco Fuelling & Fast EV Supercharger", "Avinashi Road, Peelamedu, Coimbatore", 11.0250, 77.0050, 4.7, "+91 422 257 8890", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 3.2, "$$"),
    ("Coimbatore", "Adiyogi Shiva & Isha Yoga Center", "petrol_bunk", "Bharat Petroleum Highway Fuelling Station", "Siruvani State Highway, Alandurai", 10.9580, 76.7790, 4.5, "+91 422 261 4500", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 4.0, "$$"),
    # Markets
    ("Coimbatore", "Brookefields Mall & Cross-Cut Road", "market", "Cross-Cut Road Traditional Silk & Jewelry Bazaars", "Cross-Cut Rd, Gandhipuram, Coimbatore", 11.0170, 76.9660, 4.8, "+91 422 223 9000", "Open Daily (10:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.5, "$$"),
    ("Coimbatore", None, "market", "Town Hall & Raja Street Historic Spices & Cotton Market", "Town Hall, Coimbatore", 10.9950, 76.9610, 4.7, "+91 422 239 1100", "Open Daily (09:00 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.9, "$"),
    # Rentals
    ("Coimbatore", None, "rental", "Royal Western Ghats Bike & Self-Drive Car Rentals", "Railway Station Road, Gandhipuram", 11.0150, 76.9670, 4.8, "+91 98422 77112", "Open Daily (07:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 1.2, "$$"),

    # ==========================================
    # 2. CHENNAI SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Chennai", "Edward Elliot's Beach & Besant Nagar", "restaurant", "Murugan Idli Shop & Famous Podi Tiffin (Breakfast Special)", "Besant Nagar Beach Road, Chennai", 13.0015, 80.2710, 4.8, "+91 44 2446 1234", "Breakfast (06:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.6, "$"),
    ("Chennai", "Marina Beach & Promenade", "restaurant", "Ratna Cafe Heritage Sambar Idli & Morning Filter Coffee", "Triplicane High Road, Chennai", 13.0540, 80.2760, 4.8, "+91 44 2844 1122", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.2, "$"),
    ("Chennai", None, "restaurant", "Sandy's Chocolate Laboratory & Morning Artisan Cafe", "Wallace Garden, Nungambakkam, Chennai", 13.0640, 80.2470, 4.7, "+91 44 4214 4000", "Breakfast (08:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 3.0, "$$"),
    # Lunch
    ("Chennai", "Kapaleeshwarar Temple, Mylapore", "restaurant", "Saravana Bhavan Classic Grand Thali Meals (Lunch Special)", "North Mada St, Mylapore, Chennai", 13.0345, 80.2685, 4.8, "+91 44 2464 1234", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$$"),
    ("Chennai", None, "restaurant", "The Marina Seafood & Coastal Dining (Specialty Coastal Lunch)", "College Road, Nungambakkam, Chennai", 13.0680, 80.2450, 4.9, "+91 44 4203 5656", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 3.5, "$$$"),
    ("Chennai", None, "restaurant", "Anjappar Chettinad Traditional Lunch & Crab Roast (Lunch Special)", "GN Chetty Road, T. Nagar, Chennai", 13.0410, 80.2400, 4.7, "+91 44 2815 1234", "Lunch (12:00 PM - 04:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 4.0, "$$"),
    # Dinner
    ("Chennai", "Edward Elliot's Beach & Besant Nagar", "restaurant", "Bay View Seaside Sunset & Dinner Grill at Vivanta", "Covelong Beach, ECR, Chennai Region", 12.7950, 80.2520, 4.9, "+91 44 6741 3333", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 18.0, "$$$$"),
    ("Chennai", None, "restaurant", "Peshawri at ITC Grand Chola (Royal Tandoor & Mughlai Dinner)", "Mount Road, Guindy, Chennai", 13.0105, 80.2210, 4.9, "+91 44 2220 0000", "Dinner (07:30 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 6.5, "$$$$"),
    ("Chennai", "San Thome Basilica", "restaurant", "Spectra Oceanfront Buffet & Fine Dining at The Leela Palace", "Adyar Seaface, MRC Nagar, Chennai", 13.0180, 80.2780, 4.9, "+91 44 3366 1234", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.8, "$$$$"),
    # Hotels (Budget, Moderate, Luxury)
    ("Chennai", "Marina Beach & Promenade", "hotel", "Broadlands Heritage Lodge & Backpacker Stay (Budget Stay)", "Triplicane High Road, Chennai", 13.0560, 80.2730, 4.5, "+91 44 2844 1312", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.2, "$"),
    ("Chennai", None, "hotel", "The Accord Metropolitan Hotel (Comfort Stay)", "GN Chetty Road, T. Nagar, Chennai", 13.0430, 80.2420, 4.7, "+91 44 4391 1000", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.2, "$$"),
    ("Chennai", "San Thome Basilica", "hotel", "The Leela Palace Chennai / ITC Grand Chola (Luxury Stay)", "Adyar Seaface, MRC Nagar, Chennai", 13.0180, 80.2780, 4.9, "+91 44 3366 1234", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.5, "$$$$"),
    # Hospitals
    ("Chennai", None, "hospital", "Apollo Hospitals Greams Road (24x7 Emergency & Heart Institute)", "Greams Lane, Thousand Lights, Chennai", 13.0560, 80.2520, 4.9, "+91 44 2829 0200", "24x7 Emergency", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 3.2, "$$$"),
    ("Chennai", "Edward Elliot's Beach & Besant Nagar", "hospital", "Fortis Malar Hospital (24x7 Critical Care)", "Gandhi Nagar, 1st Main Road, Adyar, Chennai", 13.0060, 80.2570, 4.8, "+91 44 4289 2222", "24x7 Critical Care", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 2.9, "$$$"),
    # Police
    ("Chennai", "Marina Beach & Promenade", "police", "Greater Chennai Tourist Police & Assistance Pavilion", "Kamarajar Salai Promenade, Marina Beach, Chennai", 13.0480, 80.2810, 4.8, "+91 44 2844 8000 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.3, "$"),
    # ATMs
    ("Chennai", "Marina Beach & Promenade", "atm", "Canara Bank 24/7 Beachfront ATM", "Kamarajar Salai Promenade, Chennai", 13.0490, 80.2815, 4.4, "1800 425 0018", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.2, "$"),
    ("Chennai", None, "atm", "State Bank of India 24x7 Forex & Cash Hub", "Anna Salai, Mount Road, Chennai", 13.0600, 80.2600, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 2.5, "$"),
    # Petrol & EV
    ("Chennai", "San Thome Basilica", "petrol_bunk", "Bharat Petroleum Coastal Outlet & EV Supercharger", "Santhome High Road, Mylapore, Chennai", 13.0380, 80.2780, 4.5, "+91 44 2464 1122", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.8, "$$"),
    ("Chennai", None, "petrol_bunk", "Indian Oil Corporation Auto Hub", "Mount Road, Guindy, Chennai", 13.0120, 80.2180, 4.6, "+91 44 2235 1200", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 6.0, "$$"),
    # Markets
    ("Chennai", None, "market", "Pondy Bazaar & Ranganathan Street Silk Market", "T. Nagar, Chennai", 13.0400, 80.2350, 4.7, "+91 44 2434 5000", "Open Daily (10:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 4.5, "$$"),
    ("Chennai", "Fort St. George & Museum", "market", "George Town & Sowcarpet Spices Bazaar", "NSC Bose Road, Sowcarpet, Chennai", 13.0900, 80.2800, 4.8, "+91 44 2538 1234", "Open Daily (09:30 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 2.0, "$"),
    # Rentals
    ("Chennai", None, "rental", "Chennai Coastal Cabs & Royal Enfield Bike Rentals", "Cathedral Road, Nungambakkam, Chennai", 13.0490, 80.2500, 4.8, "+91 98400 12345", "Open Daily (07:00 AM - 10:30 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 3.5, "$$"),

    # ==========================================
    # 3. OOTY SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Ooty", "Government Botanical Garden", "restaurant", "Nahar's Sidewalk Cafe & European Breakfast", "Commercial Road, Charing Cross, Ooty", 11.4125, 76.7040, 4.7, "+91 423 244 2173", "Breakfast (07:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.1, "$$"),
    ("Ooty", None, "restaurant", "Modern Stores Bakery & Nilgiri Hot Bakes (Breakfast Special)", "Charring Cross, Commercial Rd, Ooty", 11.4110, 76.7070, 4.8, "+91 423 244 2266", "Breakfast (07:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.0, "$"),
    ("Ooty", "Ooty Lake & Boathouse", "restaurant", "Adyar Ananda Bhavan Warm Poori & Filter Kaapi", "Upper Bazaar, Near Collectorate, Ooty", 11.4130, 76.7000, 4.6, "+91 423 244 5678", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.5, "$"),
    # Lunch
    ("Ooty", None, "restaurant", "Shinkows Authentic Chinese & Hot Soups (Lunch Special)", "38/2 Commissioner's Road, Ooty", 11.4100, 76.7020, 4.8, "+91 423 244 2296", "Lunch (12:30 PM - 03:30 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 1.2, "$$"),
    ("Ooty", None, "restaurant", "Hotel Junior Kuppanna Nilgiri Mutton Biryani & Thali (Lunch Special)", "Charring Cross, Ooty", 11.4115, 76.7060, 4.7, "+91 423 244 3344", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.1, "$$"),
    ("Ooty", None, "restaurant", "Earl's Secret Victorian Glasshouse Lunch at Kings Cliff", "Havelock Road, Ooty", 11.4190, 76.7080, 4.9, "+91 423 245 2889", "Lunch (12:30 PM - 03:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.5, "$$$"),
    # Dinner
    ("Ooty", None, "restaurant", "Savoy – IHCL SeleQtions Colonial Fireplace Dinner", "Sylks Road, Ooty", 11.4110, 76.6990, 4.9, "+91 423 222 5500", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.0, "$$$$"),
    ("Ooty", None, "restaurant", "Place To Bee Italian Organic Garden Dinner", "176/A Club Road, Near Hill Bunk, Ooty", 11.4090, 76.6950, 4.7, "+91 423 244 8888", "Dinner (07:00 PM - 10:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.8, "$$"),
    ("Ooty", None, "restaurant", "Canterbury Bar & Grill at Fortune Sullivan Court", "1 Selbourne Road, Ooty", 11.4080, 76.7150, 4.8, "+91 423 244 1415", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 2.2, "$$$"),
    # Hotels
    ("Ooty", None, "hotel", "Zostel Ooty Hill View Hostel (Budget Stay)", "Fern Hill, Ooty, Tamil Nadu", 11.3980, 76.6890, 4.6, "+91 423 244 9900", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 2.5, "$"),
    ("Ooty", None, "hotel", "Fortune Resort Sullivan Court (Comfort Stay)", "1 Selbourne Road, Ooty", 11.4080, 76.7150, 4.7, "+91 423 244 1415", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.5, "$$"),
    ("Ooty", "Government Botanical Garden", "hotel", "Savoy – IHCL SeleQtions Luxury Heritage Resort", "Sylks Road, Ooty", 11.4110, 76.6990, 4.9, "+91 423 222 5500", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 2.0, "$$$$"),
    # Hospitals
    ("Ooty", "Government Botanical Garden", "hospital", "Government Head Quarters Hospital Ooty (24x7 Emergency)", "Hospital Road, Upper Bazaar, Ooty", 11.4140, 76.7020, 4.6, "+91 423 244 2212", "Emergency 24x7", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 1.4, "$$"),
    ("Ooty", None, "hospital", "SM Hospital & Trauma Emergency Clinic", "Commercial Road, Ooty", 11.4120, 76.7050, 4.5, "+91 423 244 3800", "24x7 Emergency", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 1.0, "$$"),
    # Police
    ("Ooty", None, "police", "Ooty Central Town Police Station & Nilgiri Tourist Aid Unit", "ATC Junction, Ooty", 11.4100, 76.7010, 4.7, "+91 423 244 2222 / 100", "24x7 Tourist Assistance", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 1.1, "$"),
    # ATMs
    ("Ooty", None, "atm", "State Bank of India 24x7 Hill ATM", "Charring Cross, Ooty", 11.4115, 76.7065, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.9, "$"),
    ("Ooty", None, "atm", "Axis Bank 24x7 ATM & Cash Dispenser", "Commercial Road, Ooty", 11.4122, 76.7035, 4.4, "1800 419 5959", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 1.0, "$"),
    # Petrol & EV
    ("Ooty", None, "petrol_bunk", "Indian Oil Hill Fuel Station & EV Point", "Coonoor Road, Ooty", 11.4080, 76.7110, 4.6, "+91 423 244 2300", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.5, "$$"),
    ("Ooty", None, "petrol_bunk", "HP Petrol Pump & Tata EV Supercharger", "Fernhill Road, Ooty", 11.4000, 76.6920, 4.5, "+91 423 244 4100", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.2, "$$"),
    # Markets
    ("Ooty", "Government Botanical Garden", "market", "Ooty Tibetan Market & Woollen Bazaar", "Near Botanical Garden Entry, Ooty", 11.4170, 76.7100, 4.7, "+91 423 244 5500", "Open Daily (09:00 AM - 08:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.8, "$$"),
    ("Ooty", None, "market", "Commercial Road Homemade Chocolate & Nilgiri Tea Bazaars", "Commercial Road, Ooty", 11.4120, 76.7040, 4.8, "+91 423 244 6600", "Open Daily (09:30 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.0, "$$"),
    # Rentals
    ("Ooty", "Nilgiri Mountain Heritage Railway", "rental", "Nilgiri Mountain 4x4 Jeep Safari & Bike Rentals", "Opposite Railway Station, Ooty", 11.4065, 76.6965, 4.8, "+91 94430 11223", "Open Daily (06:30 AM - 08:30 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.5, "$$"),

    # ==========================================
    # 4. MADURAI SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Madurai", "Meenakshi Amman Temple", "restaurant", "Murugan Idli Shop & Famous Ghee Podi Idli (Breakfast Special)", "West Mada St, Madurai", 9.9180, 78.1170, 4.9, "+91 452 234 1379", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$"),
    ("Madurai", None, "restaurant", "Sree Sabarees Traditional Morning Tiffin & Madurai Filter Coffee", "West Veli Street, Madurai", 9.9160, 78.1120, 4.8, "+91 452 234 8899", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.7, "$"),
    ("Madurai", None, "restaurant", "Modern Restaurant Authentic Ghee Roast Dosa (Morning Special)", "Netaji Road, Madurai", 9.9175, 78.1160, 4.7, "+91 452 234 2233", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.5, "$$"),
    # Lunch
    ("Madurai", None, "restaurant", "Amma Mess Legendary Bone Marrow & Non-Veg Meals (Lunch Special)", "Alagar Kovil Road, Madurai", 9.9380, 78.1400, 4.9, "+91 452 253 1122", "Lunch (12:00 PM - 04:00 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 3.2, "$$"),
    ("Madurai", None, "restaurant", "Kumar Mess Traditional Madurai Banana Leaf Meals (Lunch Special)", "KK Nagar, 80 Feet Road, Madurai", 9.9320, 78.1520, 4.8, "+91 452 258 7788", "Lunch (12:30 PM - 04:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 4.0, "$$"),
    ("Madurai", "Thirumalai Nayakkar Mahal", "restaurant", "Sree Mohan Bhojanalay Rajasthani & South Indian Thali", "Town Hall Road, Madurai", 9.9150, 78.1180, 4.7, "+91 452 234 6655", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.8, "$"),
    # Dinner
    ("Madurai", None, "restaurant", "Heritage Madurai Banyan Tree Open-Air Dinner Experience", "Kochadai, Melakkal Main Rd, Madurai", 9.9350, 78.0820, 4.9, "+91 452 238 5455", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 4.5, "$$$$"),
    ("Madurai", None, "restaurant", "Bell Jumbo Rooftop Barbecue & Multicuisine Dinner", "West Perumal Maistry Street, Madurai", 9.9140, 78.1130, 4.7, "+91 452 234 5511", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.0, "$$$"),
    ("Madurai", None, "restaurant", "Famous Jigarthanda & Simmakkal Midnight Food Street", "East Marret Street, Madurai", 9.9210, 78.1250, 4.8, "+91 98421 23456", "Dinner & Late Night (06:00 PM - 01:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.5, "$"),
    # Hotels
    ("Madurai", None, "hotel", "Hotel Supreme Budget Traveler Lodge (Budget Stay)", "West Perumal Maistry St, Madurai", 9.9145, 78.1125, 4.5, "+91 452 234 3151", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.9, "$"),
    ("Madurai", None, "hotel", "Courtyard by Marriott Madurai (Comfort Stay)", "168 Alagar Kovil Road, Madurai", 9.9360, 78.1410, 4.8, "+91 452 452 4444", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 3.5, "$$"),
    ("Madurai", None, "hotel", "Heritage Madurai Luxury Resort & Spa (Luxury Stay)", "Kochadai, Melakkal Main Rd, Madurai", 9.9350, 78.0820, 4.9, "+91 452 238 5455", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.5, "$$$$"),
    # Hospitals
    ("Madurai", None, "hospital", "Meenakshi Mission Hospital & Research Centre (24x7 Emergency)", "Melur Road, Madurai", 9.9460, 78.1520, 4.9, "+91 452 426 3000", "24x7 Emergency & Trauma", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 3.2, "$$$"),
    ("Madurai", None, "hospital", "Apollo Speciality Hospitals Madurai (24x7 Critical Care)", "KK Nagar, Lake View Road, Madurai", 9.9310, 78.1500, 4.8, "+91 452 258 0880", "24x7 Critical Care", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 3.8, "$$$"),
    # Police
    ("Madurai", "Meenakshi Amman Temple", "police", "Madurai Temple Security & Tourist Police Station", "West Tower Entry, Madurai", 9.9190, 78.1180, 4.8, "+91 452 234 1100 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.2, "$"),
    # ATMs
    ("Madurai", "Meenakshi Amman Temple", "atm", "Indian Bank 24x7 Temple East Gate ATM", "East Chithirai Street, Madurai", 9.9195, 78.1205, 4.6, "1800 425 00000", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.3, "$"),
    ("Madurai", None, "atm", "HDFC Bank 24x7 ATM & Cash Counter", "KK Nagar 80 Feet Road, Madurai", 9.9325, 78.1515, 4.5, "1800 202 6161", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 3.9, "$"),
    # Petrol & EV
    ("Madurai", None, "petrol_bunk", "Indian Oil Bypass Fuel Outlet & EV Supercharging", "Bypass Road, Ponmeni, Madurai", 9.9200, 78.0950, 4.7, "+91 452 260 4400", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.8, "$$"),
    ("Madurai", None, "petrol_bunk", "BPCL Ring Road Highway Station", "Ring Road Junction, Madurai", 9.9100, 78.1600, 4.6, "+91 452 269 1100", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 4.2, "$$"),
    # Markets
    ("Madurai", "Puthu Mandapam Ancient Craft & Textile Bazaar", "market", "Puthu Mandapam Tailoring, Brass & Cotton Saree Bazaar", "Opposite East Tower, Madurai", 9.9190, 78.1210, 4.8, "+91 452 234 9900", "Open Daily (09:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.5, "$$"),
    ("Madurai", None, "market", "Madurai Flower Market (Mattuthavani Jasmine Bazaar)", "Mattuthavani, Madurai", 9.9480, 78.1620, 4.9, "+91 452 256 7700", "Open Daily (04:00 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 5.0, "$"),
    # Rentals
    ("Madurai", None, "rental", "Madurai Temple City Cabs & Two-Wheeler Rentals", "Periyar Bus Stand Junction, Madurai", 9.9130, 78.1110, 4.8, "+91 98421 98765", "Open Daily (06:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 1.0, "$$"),

    # ==========================================
    # 5. SALEM SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Salem", None, "restaurant", "Saravana Bhavan Classic Veg Tiffin & Morning Coffee", "New Bus Stand Road, Salem", 11.6680, 78.1390, 4.7, "+91 427 244 5566", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.5, "$"),
    ("Salem", None, "restaurant", "Salem R.R. Morning Pongal & Crispy Vadai House", "Suramangalam Main Rd, Salem", 11.6720, 78.1250, 4.8, "+91 427 234 1122", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.2, "$"),
    ("Salem", None, "restaurant", "Hotel Selvam Morning Tiffin & Ghee Roast Dosa", "Four Roads, Meyyanur, Salem", 11.6620, 78.1450, 4.7, "+91 427 244 8899", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.2, "$$"),
    # Lunch
    ("Salem", None, "restaurant", "Selvi Mess Traditional Salem Non-Veg & Naatu Kozhi Meals", "Meyyanur Bypass Rd, Salem", 11.6690, 78.1320, 4.8, "+91 427 244 6677", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 1.8, "$$"),
    ("Salem", None, "restaurant", "Salem Thattu Vadai Set & Mangalam South Indian Feast", "Five Roads Junction, Salem", 11.6750, 78.1360, 4.8, "+91 427 233 4455", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 2.0, "$$"),
    ("Salem", None, "restaurant", "Sri Saravana Pure Veg Thali & South Indian Lunch", "Junction Main Road, Salem", 11.6660, 78.1280, 4.6, "+91 427 234 7788", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.6, "$"),
    # Dinner
    ("Salem", "Lady's Seat & Pagoda Point Viewpoints", "restaurant", "GRT Nature Trails Sky Rocca Glass Clifftop Dinner", "Lady's Seat Road, Yercaud, Salem District", 11.7680, 78.2040, 4.9, "+91 4281 222 700", "Dinner (07:00 PM - 10:45 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 32.0, "$$$$"),
    ("Salem", None, "restaurant", "Tangerine & Terrace Barbecue at Radisson Salem", "Mamangam, Bangalore Highway, Salem", 11.6880, 78.1210, 4.8, "+91 427 277 7777", "Dinner (07:30 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 4.0, "$$$"),
    ("Salem", None, "restaurant", "Rasikas Multicuisine Rooftop Dinner", "Omalur Main Road, Fairlands, Salem", 11.6740, 78.1400, 4.7, "+91 427 244 9900", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.2, "$$"),
    # Hotels
    ("Salem", None, "hotel", "Hotel Salem Castle Budget Rooms (Budget Stay)", "Athanur Road, Salem", 11.6600, 78.1420, 4.5, "+91 427 244 8701", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.0, "$"),
    ("Salem", None, "hotel", "Grand Estancia Hotel (Comfort Stay)", "Bangalore By-pass Road, Salem", 11.6850, 78.1230, 4.7, "+91 427 228 0070", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 3.8, "$$"),
    ("Salem", "Lady's Seat & Pagoda Point Viewpoints", "hotel", "Radisson Salem / GRT Sky Rocca Yercaud (Luxury Stay)", "Mamangam, Salem / Lady's Seat, Yercaud", 11.6880, 78.1210, 4.9, "+91 427 277 7777", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.0, "$$$$"),
    # Hospitals
    ("Salem", None, "hospital", "Manipal Hospital Salem (24x7 Trauma & Emergency)", "Dalmia Board, Bangalore Highway, Salem", 11.6980, 78.1150, 4.9, "+91 427 234 6600", "24x7 Trauma & Emergency", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 3.0, "$$$"),
    ("Salem", None, "hospital", "SKS Hospital Multi-Speciality (24 Hours)", "Alagapuram, Fairlands, Salem", 11.6780, 78.1420, 4.8, "+91 427 244 5000", "24x7 Emergency", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 2.5, "$$$"),
    # Police
    ("Salem", None, "police", "Salem Central City Police Station & Helpdesk", "Fairlands Main Road, Salem", 11.6720, 78.1450, 4.7, "+91 427 244 0100 / 100", "24x7 Assistance", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 1.8, "$"),
    # ATMs
    ("Salem", None, "atm", "State Bank of India 24x7 ATM", "Suramangalam Junction, Salem", 11.6710, 78.1260, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 2.0, "$"),
    ("Salem", None, "atm", "ICICI Bank 24x7 ATM & Cash Counter", "Brindavan Road, Fairlands, Salem", 11.6750, 78.1430, 4.5, "1800 1080", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 2.2, "$"),
    # Petrol & EV
    ("Salem", None, "petrol_bunk", "Indian Oil Highway Fuelling Station & EV Hub", "Bangalore Bypass Highway, Salem", 11.6910, 78.1200, 4.7, "+91 427 238 9900", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 3.5, "$$"),
    ("Salem", None, "petrol_bunk", "HP Fuelling & EV Supercharge Station", "Five Roads Junction, Meyyanur, Salem", 11.6740, 78.1370, 4.6, "+91 427 244 1200", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.9, "$$"),
    # Markets
    ("Salem", None, "market", "Salem Shevapet Traditional Silver & Mango Wholesale Bazaar", "Shevapet, Salem", 11.6520, 78.1480, 4.8, "+91 427 221 3300", "Open Daily (09:00 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.4, "$$"),
    ("Salem", None, "market", "Fairlands Modern Silk & Textile Plaza", "Fairlands, Salem", 11.6730, 78.1440, 4.7, "+91 427 244 7700", "Open Daily (10:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 2.1, "$$"),
    # Rentals
    ("Salem", "Yercaud Lake & Emerald Valley", "rental", "Salem Yercaud Ghats Cab Service & Bike Rentals", "Salem Railway Junction Gate", 11.6700, 78.1240, 4.7, "+91 94432 44556", "Open Daily (06:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 2.0, "$$"),

    # ==========================================
    # 6. BENGALURU SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Bengaluru", "Lalbagh Botanical Gardens & Glass House", "restaurant", "MTR 1924 (Mavalli Tiffin Room) - Heritage Breakfast & Filter Coffee", "Lalbagh Fort Road, Mavalli, Bengaluru", 12.9540, 77.5855, 4.9, "+91 80 2222 0022", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.4, "$$"),
    ("Bengaluru", None, "restaurant", "Vidyarthi Bhavan Famous Benne Masala Dosa", "Gandhi Bazaar Main Rd, Basavanagudi, Bengaluru", 12.9430, 77.5700, 4.9, "+91 80 2667 7588", "Breakfast (06:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.8, "$"),
    ("Bengaluru", "Cubbon Park & Attara Kacheri", "restaurant", "Brahmin's Coffee Bar Warm Idli, Vada & Coconut Chutney", "Ranga Rao Rd, Shankarapuram, Bengaluru", 12.9490, 77.5680, 4.8, "+91 98450 30214", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 2.2, "$"),
    # Lunch
    ("Bengaluru", None, "restaurant", "Nagarjuna Authentic Andhra Meals on Banana Leaf (Lunch Special)", "Residency Road, Bengaluru", 12.9710, 77.6030, 4.8, "+91 80 4112 5599", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.5, "$$"),
    ("Bengaluru", "Lalbagh Botanical Gardens & Glass House", "restaurant", "MTR Grand Karnataka Thali (Lunch Special)", "Lalbagh Fort Road, Bengaluru", 12.9540, 77.5855, 4.9, "+91 80 2222 0022", "Lunch (12:30 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.4, "$$"),
    ("Bengaluru", None, "restaurant", "Meghana Foods Famous Andhra Chicken Biryani (Lunch Special)", "Koramangala 5th Block, Bengaluru", 12.9340, 77.6200, 4.8, "+91 80 4146 3738", "Lunch (11:30 AM - 04:00 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 4.5, "$$"),
    # Dinner
    ("Bengaluru", None, "restaurant", "High Ultra Lounge Rooftop Asian Dining (31st Floor WTC)", "World Trade Center, Malleshwaram, Bengaluru", 13.0120, 77.5550, 4.9, "+91 80 4567 4567", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 6.0, "$$$$"),
    ("Bengaluru", None, "restaurant", "The Windmills Craftworks Jazz & Terrace Dinner", "331 Road, Whitefield, Bengaluru", 12.9830, 77.7240, 4.9, "+91 88802 33322", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 14.0, "$$$$"),
    ("Bengaluru", None, "restaurant", "Karavalli Coastal Seafood at The Gateway Hotel", "Residency Road, Bengaluru", 12.9700, 77.6050, 4.9, "+91 80 6660 4545", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.8, "$$$$"),
    # Hotels
    ("Bengaluru", None, "hotel", "Zostel Bangalore Backpacker Hostel (Budget Stay)", "100ft Road, Indiranagar, Bengaluru", 12.9720, 77.6400, 4.6, "+91 80 4099 1100", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.5, "$"),
    ("Bengaluru", None, "hotel", "The Chancery Pavilion (Comfort Stay)", "135 Residency Road, Bengaluru", 12.9680, 77.5980, 4.7, "+91 80 4141 4141", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.2, "$$"),
    ("Bengaluru", "Lalbagh Botanical Gardens & Glass House", "hotel", "The Ritz-Carlton / ITC Gardenia (Luxury Stay)", "Residency Road, Ashok Nagar, Bengaluru", 12.9690, 77.6010, 4.9, "+91 80 4914 8000", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.5, "$$$$"),
    # Hospitals
    ("Bengaluru", "Bannerghatta Biological Safari & Butterfly Park", "hospital", "Fortis Hospital Bannerghatta (24x7 Emergency & Heart Care)", "154/9 Bannerghatta Main Rd, Bengaluru", 12.8930, 77.5970, 4.9, "+91 80 6621 4444", "24x7 Emergency", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 3.4, "$$$"),
    ("Bengaluru", None, "hospital", "Manipal Hospital Old Airport Road (24x7 Quaternary Trauma)", "98 Old Airport Road, Kodihalli, Bengaluru", 12.9580, 77.6480, 4.9, "+91 80 2502 4444", "24x7 Trauma", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 5.0, "$$$"),
    # Police
    ("Bengaluru", "Cubbon Park & Attara Kacheri", "police", "Bengaluru City Tourist Police Cell & Safety Helpdesk", "Infantry Road, Near Police Commissioner Office, Bengaluru", 12.9800, 77.5950, 4.8, "+91 80 2294 2222 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.9, "$"),
    # ATMs
    ("Bengaluru", None, "atm", "Canara Bank 24x7 ATM Hub", "MG Road Metro Station, Bengaluru", 12.9750, 77.6070, 4.6, "1800 425 0018", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 1.0, "$"),
    ("Bengaluru", None, "atm", "HDFC Bank 24x7 ATM & Forex Counter", "Indiranagar 100 Feet Road, Bengaluru", 12.9710, 77.6420, 4.6, "1800 202 6161", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 4.2, "$"),
    # Petrol & EV
    ("Bengaluru", None, "petrol_bunk", "Shell Super Fuelling & EV Fast Charging Station", "Koramangala Inner Ring Rd, Bengaluru", 12.9380, 77.6250, 4.8, "+91 80 2552 9000", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 4.0, "$$"),
    ("Bengaluru", "Cubbon Park & Attara Kacheri", "petrol_bunk", "Indian Oil Corporation Auto Fuels", "Cubbon Road, Bengaluru", 12.9780, 77.6010, 4.6, "+91 80 2286 1122", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.2, "$$"),
    # Markets
    ("Bengaluru", "Commercial Street & Russell Market", "market", "Commercial Street & Brigade Road Fashion Bazaar", "Shivaji Nagar, Tasker Town, Bengaluru", 12.9820, 77.6080, 4.8, "+91 80 2558 7700", "Open Daily (10:30 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 2.2, "$$"),
    ("Bengaluru", None, "market", "Gandhi Bazaar Traditional Spices, Flowers & Ayurvedic Herbs", "Basavanagudi, Bengaluru", 12.9440, 77.5710, 4.8, "+91 80 2661 1100", "Open Daily (07:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 2.0, "$$"),
    # Rentals
    ("Bengaluru", None, "rental", "Royal Brothers Bike Rental & City Cabs", "Indiranagar / MG Road Metro Station", 12.9750, 77.6080, 4.8, "+91 90195 95595", "Open Daily (06:00 AM - 11:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 1.1, "$$"),

    # ==========================================
    # 7. KODAIKANAL SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Kodaikanal", None, "restaurant", "Cloud Street Cafe Wood-Fired Bakes & Morning Waffles", "PT Road, Kodaikanal", 10.2340, 77.4930, 4.8, "+91 4542 240 456", "Breakfast (07:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.4, "$$"),
    ("Kodaikanal", None, "restaurant", "Daily Bread Pastry & Continental Breakfast Corner", "Seven Roads Junction, Kodaikanal", 10.2315, 77.4950, 4.7, "+91 4542 241 122", "Breakfast (07:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.6, "$"),
    ("Kodaikanal", "Kodaikanal Lake & Star-Shaped Promenade", "restaurant", "Astoria Veg Morning Tiffin & Filter Coffee", "Anna Salai, Kodaikanal", 10.2320, 77.4910, 4.6, "+91 4542 240 789", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$"),
    # Lunch
    ("Kodaikanal", None, "restaurant", "Muncheez European Gourmet Wraps & Burgers (Lunch Special)", "PT Road, Kodaikanal", 10.2345, 77.4935, 4.8, "+91 4542 242 233", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.5, "$$"),
    ("Kodaikanal", None, "restaurant", "Tibetan Brothers Authentic Steamed Momos & Thukpa", "Club Road, Kodaikanal", 10.2330, 77.4960, 4.7, "+91 4542 240 890", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.7, "$"),
    ("Kodaikanal", None, "restaurant", "Royal Tibet Hot Noodle Bowls & Shabalay (Lunch Special)", "PT Road, Kodaikanal", 10.2350, 77.4925, 4.6, "+91 4542 241 556", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.4, "$"),
    # Dinner
    ("Kodaikanal", "Kodaikanal Lake & Star-Shaped Promenade", "restaurant", "Silver Oak Luxury Dining at The Carlton", "Lake Road, Kodaikanal", 10.2325, 77.4910, 4.9, "+91 4542 248 555", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.2, "$$$$"),
    ("Kodaikanal", "Dolphin's Nose & Echo Rock (Vattakanal)", "restaurant", "Altaf's Cafe Middle Eastern & Sunset Clifftop Dining", "Vattakanal, Kodaikanal", 10.2150, 77.4980, 4.8, "+91 94871 23456", "Dinner (06:00 PM - 10:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 5.5, "$$"),
    ("Kodaikanal", None, "restaurant", "Hilltop Wood-Fired Pizzeria & Italian Garden", "Club Road, Kodaikanal", 10.2320, 77.4940, 4.7, "+91 4542 240 999", "Dinner (07:00 PM - 10:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.6, "$$"),
    # Hotels
    ("Kodaikanal", "Coaker's Walk & Cloud Viewpoint", "hotel", "Greenlands Youth Hostel & Backpacker Haven (Budget Stay)", "Near Coaker's Walk, Kodaikanal", 10.2305, 77.4975, 4.6, "+91 4542 240 899", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.9, "$"),
    ("Kodaikanal", None, "hotel", "Sterling Kodai Valley & Lake Resort (Comfort Stay)", "Gymkhana Road, Kodaikanal", 10.2280, 77.5050, 4.7, "+91 4542 246 000", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 2.0, "$$"),
    ("Kodaikanal", "Kodaikanal Lake & Star-Shaped Promenade", "hotel", "The Carlton Luxury Lakefront Heritage Resort (Luxury Stay)", "Lake Road, Kodaikanal", 10.2325, 77.4910, 4.9, "+91 4542 248 555", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.2, "$$$$"),
    # Hospitals
    ("Kodaikanal", None, "hospital", "Van Allen Hospital & Trauma Emergency Center", "Seven Roads Junction, Kodaikanal", 10.2310, 77.4940, 4.7, "+91 4542 241 213", "24x7 Emergency", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 0.8, "$$"),
    ("Kodaikanal", None, "hospital", "Government Hospital Kodaikanal (24 Hours)", "Lake Road, Kodaikanal", 10.2335, 77.4870, 4.5, "+91 4542 241 230", "Emergency 24x7", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 0.6, "$"),
    # Police
    ("Kodaikanal", None, "police", "Kodaikanal Town Police Station & Hill Tourist Help", "Bazaar Road, Kodaikanal", 10.2315, 77.4920, 4.7, "+91 4542 240 222 / 100", "24x7 Assistance", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.5, "$"),
    # ATMs
    ("Kodaikanal", None, "atm", "State Bank of India 24x7 Lakefront ATM", "Seven Roads Junction, Kodaikanal", 10.2312, 77.4945, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.7, "$"),
    ("Kodaikanal", None, "atm", "Canara Bank 24x7 Hill ATM", "PT Road, Kodaikanal", 10.2340, 77.4932, 4.4, "1800 425 0018", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.4, "$"),
    # Petrol & EV
    ("Kodaikanal", None, "petrol_bunk", "Bharat Petroleum Hilltop Fuel Station", "Batlagundu Kodai Ghat Road, Kodaikanal", 10.2380, 77.5100, 4.6, "+91 4542 241 190", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 3.0, "$$"),
    ("Kodaikanal", None, "petrol_bunk", "Indian Oil Station & Tata EV Charger", "Seven Roads Junction, Kodaikanal", 10.2310, 77.4950, 4.6, "+91 4542 240 300", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 0.8, "$$"),
    # Markets
    ("Kodaikanal", None, "market", "Kodaikanal Spices, Homemade Chocolates & Eucalyptus Bazaar", "PT Road, Kodaikanal", 10.2335, 77.4930, 4.8, "+91 4542 240 500", "Open Daily (09:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.4, "$$"),
    ("Kodaikanal", None, "market", "Danish Display & Cottage Crafts Market", "Bazaar Road, Kodaikanal", 10.2320, 77.4925, 4.7, "+91 4542 241 600", "Open Daily (09:30 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.5, "$$"),
    # Rentals
    ("Kodaikanal", "Kodaikanal Lake & Star-Shaped Promenade", "rental", "Kodai Mountain Cycles, Horse Riding & Taxi Stand", "Lake Promenade Gate #1, Kodaikanal", 10.2320, 77.4900, 4.8, "Guild Union", "Open Daily (07:30 AM - 07:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.2, "$"),

    # ==========================================
    # 8. PONDICHERRY SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Pondicherry", "French War Memorial & White Town Quarter", "restaurant", "Baker Street Artisan French Bakery & Croissants (Breakfast Special)", "Bussy Street, White Town, Puducherry", 11.9335, 79.8325, 4.9, "+91 413 420 0055", "Breakfast (07:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.3, "$$"),
    ("Pondicherry", "Promenade Beach & Goubert Avenue", "restaurant", "Cafe des Arts French Crepes, Baguettes & Cold Brew", "10 Suffren Street, White Town, Puducherry", 11.9340, 79.8330, 4.8, "+91 413 420 0077", "Breakfast (08:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.4, "$$"),
    ("Pondicherry", None, "restaurant", "Surguru Spotless Morning Vegetarian Tiffin & Filter Coffee", "104 Sardar Vallabhai Patel Salai, Puducherry", 11.9380, 79.8290, 4.7, "+91 413 222 7290", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.9, "$"),
    # Lunch
    ("Pondicherry", "French War Memorial & White Town Quarter", "restaurant", "Coromandel Cafe & Victorian Garden Bistro (Lunch Special)", "8 Romain Rolland St, White Town, Puducherry", 11.9325, 79.8340, 4.9, "+91 413 222 1112", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.3, "$$$"),
    ("Pondicherry", None, "restaurant", "Appachi Traditional Chettinad Banana Leaf Meals (Lunch Special)", "9 Ranga Pillai Street, Puducherry", 11.9360, 79.8280, 4.8, "+91 413 222 2333", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.8, "$$"),
    ("Pondicherry", None, "restaurant", "Cafe Xtasi Famous Wood-Fired Giant Pizzas (Lunch Special)", "Mission Street, Puducherry", 11.9355, 79.8305, 4.7, "+91 413 222 6677", "Lunch (12:30 PM - 04:00 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.6, "$$"),
    # Dinner
    ("Pondicherry", "Promenade Beach & Goubert Avenue", "restaurant", "Palais de Mahe Courtyard Candlelight French Dining", "Bussy Street, White Town, Puducherry", 11.9330, 79.8350, 4.9, "+91 413 222 7750", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.2, "$$$$"),
    ("Pondicherry", "Promenade Beach & Goubert Avenue", "restaurant", "Bay of Buddha Rooftop Pan-Asian Dining with Ocean View", "The Promenade, Goubert Ave, Puducherry", 11.9332, 79.8355, 4.8, "+91 413 222 7750", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.1, "$$$$"),
    ("Pondicherry", "French War Memorial & White Town Quarter", "restaurant", "Villa Shanti Fine French-Indian Fusion Courtyard Dinner", "14 Suffren Street, White Town, Puducherry", 11.9345, 79.8335, 4.8, "+91 413 420 0028", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$$$$"),
    # Hotels
    ("Pondicherry", "French War Memorial & White Town Quarter", "hotel", "Micasa Hostel & French Quarter Backpacker Stay (Budget Stay)", "White Town, Puducherry", 11.9340, 79.8320, 4.6, "+91 413 222 9900", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.4, "$"),
    ("Pondicherry", None, "hotel", "Hotel du Parc Heritage French Boutique (Comfort Stay)", "Jawaharlal Nehru St, Puducherry", 11.9350, 79.8310, 4.7, "+91 413 222 7800", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.6, "$$"),
    ("Pondicherry", "Promenade Beach & Goubert Avenue", "hotel", "The Promenade / Palais de Mahe Luxury Seafront Resort", "Goubert Avenue, White Town, Puducherry", 11.9330, 79.8350, 4.9, "+91 413 222 7750", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.2, "$$$$"),
    # Hospitals
    ("Pondicherry", None, "hospital", "JIPMER Multi-Specialty & Emergency Trauma Center (24x7)", "Dhanvantari Nagar, Gorimedu, Puducherry", 11.9560, 79.7980, 4.9, "+91 413 229 6000", "24x7 Quaternary Trauma", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 4.5, "$$"),
    ("Pondicherry", None, "hospital", "Indira Gandhi Government General Hospital & Post Graduate Institute", "Victor Simonel St, Puducherry", 11.9320, 79.8310, 4.6, "+91 413 233 6050", "Emergency 24x7", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 0.5, "$"),
    # Police
    ("Pondicherry", "Promenade Beach & Goubert Avenue", "police", "Puducherry Tourist Police Booth", "Goubert Avenue Promenade, White Town", 11.9335, 79.8352, 4.8, "+91 413 233 4400 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.1, "$"),
    # ATMs
    ("Pondicherry", "French War Memorial & White Town Quarter", "atm", "State Bank of India 24x7 White Town ATM", "Suffren Street, White Town, Puducherry", 11.9340, 79.8338, 4.6, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.3, "$"),
    ("Pondicherry", None, "atm", "HDFC Bank 24x7 ATM & International Forex", "Mission Street, Puducherry", 11.9360, 79.8300, 4.5, "1800 202 6161", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.7, "$"),
    # Petrol & EV
    ("Pondicherry", None, "petrol_bunk", "Indian Oil Seaside Fuelling Point", "Cuddalore Road, Puducherry", 11.9150, 79.8200, 4.6, "+91 413 220 1100", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.2, "$$"),
    ("Pondicherry", "Auroville & Golden Matrimandir", "petrol_bunk", "BPCL Heritage Fuel & EV Fast Station", "East Coast Road, Near Auroville Turn", 11.9800, 79.8300, 4.7, "+91 413 262 2200", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 5.0, "$$"),
    # Markets
    ("Pondicherry", None, "market", "Goubert Market Traditional Fresh Produce & Spice Bazaar", "Grand Bazaar, Rangapillai St, Puducherry", 11.9340, 79.8260, 4.8, "+91 413 222 4500", "Open Daily (07:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.0, "$"),
    ("Pondicherry", None, "market", "Casablanca Lifestyle & Auroville Handicrafts Boutique", "165 Mission Street, Puducherry", 11.9350, 79.8300, 4.8, "+91 413 222 6495", "Open Daily (10:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.6, "$$$"),
    # Rentals
    ("Pondicherry", "French War Memorial & White Town Quarter", "rental", "French Town Vintage Vespa & Bicycle Rentals", "Mission Street, Puducherry", 11.9350, 79.8300, 4.8, "+91 94880 12345", "Open Daily (08:00 AM - 09:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.6, "$$"),

    # ==========================================
    # 9. KANYAKUMARI SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Kanyakumari", "Vivekananda Rock Memorial & Ferry", "restaurant", "Hotel Saravana Coastal Veg Morning Idli & Coffee", "Kovalam Road, Kanyakumari", 8.0800, 77.5520, 4.8, "+91 4652 246 800", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$"),
    ("Kanyakumari", None, "restaurant", "Sree Annapoorna Tiffin Center & Filter Coffee", "Main Road, Kanyakumari", 8.0830, 77.5510, 4.7, "+91 4652 247 112", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.6, "$"),
    ("Kanyakumari", "Kanyakumari Beach & Triveni Sangam", "restaurant", "Triveni Oceanview Morning Breakfast Diner", "Beach Road, Kanyakumari", 8.0810, 77.5535, 4.6, "+91 4652 246 333", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.2, "$$"),
    # Lunch
    ("Kanyakumari", None, "restaurant", "The Ocean Heritage Coastal Seafood & Fish Curry Thali", "Kovalam Road, Kanyakumari", 8.0820, 77.5500, 4.8, "+91 4652 247 889", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.7, "$$"),
    ("Kanyakumari", "Kanyakumari Beach & Triveni Sangam", "restaurant", "Hotel Tamil Nadu (TTDC) Sea View Lunch Buffet", "Beach Road, Kanyakumari", 8.0805, 77.5525, 4.7, "+91 4652 246 257", "Lunch (12:30 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.3, "$$"),
    ("Kanyakumari", None, "restaurant", "Archana Pure Vegetarian Grand South Indian Meals", "Main Road, Kanyakumari", 8.0840, 77.5490, 4.6, "+91 4652 246 555", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.8, "$"),
    # Dinner
    ("Kanyakumari", "Sunset Point & Hidden Beach", "restaurant", "Sparsa Luxury Open-Air Seafront Candlelight Dinner", "Beach Road, Kanyakumari", 8.0810, 77.5530, 4.9, "+91 4652 247 041", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.8, "$$$$"),
    ("Kanyakumari", None, "restaurant", "Sea View Sunset Terrace Multicuisine Restaurant", "East Car Street, Kanyakumari", 8.0815, 77.5540, 4.8, "+91 4652 247 841", "Dinner (07:00 PM - 10:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.4, "$$$"),
    ("Kanyakumari", None, "restaurant", "Triveni Coastal Dinner & Fresh Catch Grill", "Main Road, Kanyakumari", 8.0825, 77.5515, 4.7, "+91 4652 246 999", "Dinner (07:00 PM - 10:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.5, "$$"),
    # Hotels
    ("Kanyakumari", None, "hotel", "Hotel Seaface Budget Oceanview Rooms (Budget Stay)", "South Car Street, Kanyakumari", 8.0800, 77.5510, 4.5, "+91 4652 246 444", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.4, "$"),
    ("Kanyakumari", None, "hotel", "Hotel Sea View Kanyakumari (Comfort Stay)", "East Car Street, Kanyakumari", 8.0815, 77.5540, 4.7, "+91 4652 247 841", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.5, "$$"),
    ("Kanyakumari", "Vivekananda Rock Memorial & Ferry", "hotel", "Sparsa Resort Seafront Luxury & Wellness (Luxury Stay)", "Beach Road, Kanyakumari", 8.0810, 77.5530, 4.9, "+91 4652 247 041", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.8, "$$$$"),
    # Hospitals
    ("Kanyakumari", None, "hospital", "Government Headquarters Hospital (24x7 Emergency Trauma)", "Cape Road, Kottar, Nagercoil / Kanyakumari", 8.1800, 77.4300, 4.7, "+91 4652 232 233", "24x7 Emergency Trauma", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 12.0, "$"),
    ("Kanyakumari", None, "hospital", "CSI Mission Hospital & Coastal Emergency Unit", "Nagercoil Road, Kanyakumari District", 8.1200, 77.5000, 4.6, "+91 4652 240 100", "24x7 Emergency", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 6.0, "$$"),
    # Police
    ("Kanyakumari", "Kanyakumari Beach & Triveni Sangam", "police", "Kanyakumari Beach Police & Coastal Tourist Security Post", "Beach Road Promenade, Kanyakumari", 8.0805, 77.5532, 4.8, "+91 4652 246 224 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.2, "$"),
    # ATMs
    ("Kanyakumari", "Vivekananda Rock Memorial & Ferry", "atm", "State Bank of India 24x7 Oceanfront ATM", "Beach Road, Kanyakumari", 8.0812, 77.5528, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.3, "$"),
    ("Kanyakumari", None, "atm", "Indian Overseas Bank 24x7 ATM", "Main Road, Kanyakumari", 8.0835, 77.5505, 4.4, "1800 425 1400", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.6, "$"),
    # Petrol & EV
    ("Kanyakumari", None, "petrol_bunk", "Indian Oil Southernmost Tip Petrol Station", "Cape Road, Kanyakumari", 8.0860, 77.5450, 4.6, "+91 4652 246 110", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.2, "$$"),
    ("Kanyakumari", None, "petrol_bunk", "HPCL Coastal Highway Fuel Outlet & EV Charger", "NH 44, Kanyakumari", 8.0900, 77.5400, 4.6, "+91 4652 246 900", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.8, "$$"),
    # Markets
    ("Kanyakumari", "Kanyakumari Beach & Triveni Sangam", "market", "Sea Shell Crafts & Conch Souvenir Street Bazaar", "Beach Road, Kanyakumari", 8.0810, 77.5520, 4.7, "+91 4652 246 700", "Open Daily (08:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.3, "$"),
    ("Kanyakumari", None, "market", "Poompuhar Handicrafts & Wood Carving Emporium", "Main Road, Kanyakumari", 8.0825, 77.5510, 4.8, "+91 4652 246 312", "Open Daily (09:30 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.5, "$$"),
    # Rentals
    ("Kanyakumari", "Vivekananda Rock Memorial & Ferry", "rental", "Kanyakumari Triveni Cabs & Two-Wheeler Rentals", "Near Ferry Pier, Kanyakumari", 8.0800, 77.5525, 4.7, "+91 94431 88990", "Open Daily (06:00 AM - 09:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.3, "$$"),

    # ==========================================
    # 10. THANJAVUR SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Thanjavur", "Brihadeeswara Temple (Big Temple)", "restaurant", "Sree Ariya Bhavan Classic Vegetarian Tiffin & Kaapi", "Old Bus Stand, Hospital Road, Thanjavur", 10.7850, 79.1340, 4.8, "+91 4362 231 155", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.4, "$"),
    ("Thanjavur", None, "restaurant", "Hotel Gnanam Morning Tiffin & Hot Ghee Roast Dosa", "Anna Salai, Thanjavur", 10.7870, 79.1380, 4.8, "+91 4362 278 501", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.8, "$$"),
    ("Thanjavur", None, "restaurant", "Vasantha Bhavan Warm Pongal & Medu Vada House", "Old Bus Stand, Thanjavur", 10.7845, 79.1335, 4.7, "+91 4362 230 456", "Breakfast (06:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.5, "$"),
    # Lunch
    ("Thanjavur", None, "restaurant", "Svatma Aaharam Traditional Royal Tamil Chola Feast", "Blake High School Road, Thanjavur", 10.7800, 79.1350, 4.9, "+91 4362 273 222", "Lunch (12:30 PM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.0, "$$$"),
    ("Thanjavur", None, "restaurant", "Thillana Multicuisine South Indian Lunch Meals", "Sangam Hotel, Trichy Road, Thanjavur", 10.7760, 79.1250, 4.8, "+91 4362 225 151", "Lunch (12:00 PM - 03:30 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 1.8, "$$"),
    ("Thanjavur", None, "restaurant", "Hotel Parisutham Chola Lunch Thali & South Delicacies", "55 Grand Anicut Road, Thanjavur", 10.7810, 79.1300, 4.7, "+91 4362 231 801", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.9, "$$"),
    # Dinner
    ("Thanjavur", None, "restaurant", "Svatma Heritage Courtyard Classical Music Dinner", "Blake High School Road, Thanjavur", 10.7800, 79.1350, 4.9, "+91 4362 273 222", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.0, "$$$$"),
    ("Thanjavur", None, "restaurant", "Sangam Hotel Lawn Barbecue & Tandoori Garden Diner", "Trichy Road, Thanjavur", 10.7760, 79.1250, 4.8, "+91 4362 225 151", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.8, "$$$"),
    ("Thanjavur", None, "restaurant", "Rice Bowl Multicuisine Family Restaurant", "South Rampart, Thanjavur", 10.7860, 79.1360, 4.7, "+91 4362 232 400", "Dinner (07:00 PM - 10:30 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.7, "$$"),
    # Hotels
    ("Thanjavur", None, "hotel", "Hotel Gnanam Budget Rooms (Budget Stay)", "Anna Salai, Market, Thanjavur", 10.7870, 79.1380, 4.5, "+91 4362 278 501", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 0.8, "$"),
    ("Thanjavur", None, "hotel", "Sangam Hotel Thanjavur (Comfort Stay)", "Trichy Road, Thanjavur", 10.7760, 79.1250, 4.7, "+91 4362 225 151", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.8, "$$"),
    ("Thanjavur", "Brihadeeswara Temple (Big Temple)", "hotel", "Svatma Chola Heritage Luxury Resort & Spa (Luxury Stay)", "Blake High School Road, Thanjavur", 10.7800, 79.1350, 4.9, "+91 4362 273 222", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.0, "$$$$"),
    # Hospitals
    ("Thanjavur", None, "hospital", "Meenakshi Hospital Multi-Specialty (24x7 Emergency)", "Trichy Main Road, Thanjavur", 10.7720, 79.1120, 4.9, "+91 4362 226 000", "24x7 Emergency", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 3.0, "$$$"),
    ("Thanjavur", None, "hospital", "Thanjavur Medical College Hospital (24 Hours)", "Medical College Road, Thanjavur", 10.7600, 79.1100, 4.6, "+91 4362 240 024", "Emergency 24x7", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 4.2, "$"),
    # Police
    ("Thanjavur", "Brihadeeswara Temple (Big Temple)", "police", "Thanjavur Big Temple Tourist Police Outpost & Helpdesk", "Near Big Temple West Gate, Thanjavur", 10.7825, 79.1310, 4.8, "+91 4362 230 100 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.2, "$"),
    # ATMs
    ("Thanjavur", "Brihadeeswara Temple (Big Temple)", "atm", "City Union Bank 24x7 Big Temple ATM", "Near Big Temple Parking, Thanjavur", 10.7830, 79.1325, 4.6, "1800 258 7400", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.2, "$"),
    ("Thanjavur", None, "atm", "State Bank of India 24x7 ATM & Cash Dispenser", "Hospital Road, Thanjavur", 10.7855, 79.1350, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.5, "$"),
    # Petrol & EV
    ("Thanjavur", None, "petrol_bunk", "Indian Oil Corporation Fuelling Station", "Trichy Road, Thanjavur", 10.7750, 79.1220, 4.6, "+91 4362 221 400", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.0, "$$"),
    ("Thanjavur", None, "petrol_bunk", "Bharat Petroleum Chola Highway Petrol Bunk", "Pudukottai Road, Thanjavur", 10.7700, 79.1350, 4.5, "+91 4362 223 900", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.5, "$$"),
    # Markets
    ("Thanjavur", "Thanjavur Art & Doll Weaving Village", "market", "Thanjavur Art Plate & Bronze Casting Craft Guild", "East Main Street, Thanjavur", 10.7920, 79.1380, 4.8, "+91 4362 233 700", "Open Daily (09:30 AM - 09:00 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 1.5, "$$"),
    ("Thanjavur", None, "market", "South Rampart Silk Saree & Traditional Weavers Bazaar", "South Rampart, Thanjavur", 10.7870, 79.1365, 4.7, "+91 4362 234 500", "Open Daily (10:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.8, "$$"),
    # Rentals
    ("Thanjavur", None, "rental", "Chola Heritage Cabs & Local Auto Tour Service", "Old Bus Stand, Thanjavur", 10.7850, 79.1330, 4.8, "+91 94433 12345", "Open Daily (06:00 AM - 10:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.5, "$$"),

    # ==========================================
    # 11. MYSURU SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Mysuru", "Mysore Royal Palace (Amba Vilas)", "restaurant", "Hotel Original Vinayaka Mylari Famous Melt-in-Mouth Butter Dosa", "Shop No 79, Shop No 80, Nazarbad Main Rd, Mysuru", 12.3080, 76.6570, 4.9, "+91 94486 08710", "Breakfast (06:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.5, "$"),
    ("Mysuru", None, "restaurant", "Gayatri Tiffin Room (GTR) Crispy Benne Dosa & Filter Coffee", "Chamundipuram, Mysuru", 12.2960, 76.6520, 4.9, "+91 821 233 2211", "Breakfast (06:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.8, "$"),
    ("Mysuru", None, "restaurant", "Mahesh Prasad Veg Morning Idli, Vada & Filter Coffee", "Ballal Circle, Chamarajapuram, Mysuru", 12.3010, 76.6430, 4.8, "+91 821 242 8899", "Breakfast (06:00 AM - 11:00 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.5, "$"),
    # Lunch
    ("Mysuru", None, "restaurant", "Hotel RRR Famous Royal Andhra & Karnataka Spicy Biryani & Meals", "Gandhi Square, Mysuru", 12.3110, 76.6530, 4.9, "+91 821 244 2333", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.6, "$$"),
    ("Mysuru", None, "restaurant", "Hotel Hanumanthu 1930 Famous Mutton Pulao (Lunch Special)", "Mandi Mohalla, Mysuru", 12.3200, 76.6510, 4.8, "+91 821 244 8877", "Lunch (12:30 PM - 04:00 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.8, "$$"),
    ("Mysuru", None, "restaurant", "Dasaprakash Heritage Pure Veg Thali & South Indian Meals", "Gandhi Square, Mysuru", 12.3100, 76.6520, 4.7, "+91 821 244 2444", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.7, "$$"),
    # Dinner
    ("Mysuru", None, "restaurant", "Lalitha Mahal Palace Royal Dining Room", "Siddhartha Layout, Mysuru", 12.2980, 76.6850, 4.9, "+91 821 247 0444", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 4.0, "$$$$"),
    ("Mysuru", None, "restaurant", "Spring Multicuisine Garden Restaurant at Radisson Blu", "1 MG Road, Mysuru", 12.3010, 76.6620, 4.9, "+91 821 710 1234", "Dinner (07:00 PM - 11:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 1.2, "$$$$"),
    ("Mysuru", None, "restaurant", "Oyster Bay Seafood & Barbecue Dinner", "Vijay Nagar, Mysuru", 12.3350, 76.6200, 4.8, "+91 821 241 1234", "Dinner (07:00 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 4.5, "$$$"),
    # Hotels
    ("Mysuru", None, "hotel", "Roamer's Backpacker & Traveler Hostel (Budget Stay)", "Gokulam 3rd Stage, Mysuru", 12.3280, 76.6320, 4.6, "+91 821 400 1122", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 3.5, "$"),
    ("Mysuru", None, "hotel", "Grand Mercure Mysore (Comfort Stay)", "Sayyaji Rao Road, Nelson Mandela Circle, Mysuru", 12.3320, 76.6450, 4.8, "+91 821 402 1212", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 2.8, "$$"),
    ("Mysuru", "Mysore Royal Palace (Amba Vilas)", "hotel", "Radisson Blu Plaza / Lalitha Mahal Palace (Luxury Stay)", "MG Road & Siddhartha Layout, Mysuru", 12.3010, 76.6620, 4.9, "+91 821 710 1234", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 1.2, "$$$$"),
    # Hospitals
    ("Mysuru", None, "hospital", "Apollo BGS Hospitals (24x7 Emergency & Heart Institute)", "Adichunchanagiri Road, Kuvempunagar, Mysuru", 12.2850, 76.6320, 4.9, "+91 821 256 8888", "24x7 Emergency & Cardiac", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 3.2, "$$$"),
    ("Mysuru", None, "hospital", "Columbia Asia / Manipal Hospital Mysuru (24 Hours)", "Bangalore-Mysore Ring Road, Bannimantap, Mysuru", 12.3450, 76.6500, 4.8, "+91 821 398 9898", "24x7 Critical Care", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 4.0, "$$$"),
    # Police
    ("Mysuru", "Mysore Royal Palace (Amba Vilas)", "police", "Mysuru Palace Tourist Police Booth & Security Station", "Varaha Gate, Mysore Palace, Mysuru", 12.3050, 76.6540, 4.8, "+91 821 241 8100 / 100", "24x7 Tourist Aid", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.2, "$"),
    # ATMs
    ("Mysuru", None, "atm", "State Bank of India 24x7 Central ATM", "Sayyaji Rao Road, Mysuru", 12.3095, 76.6515, 4.6, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.6, "$"),
    ("Mysuru", None, "atm", "Canara Bank 24x7 ATM & Cash Hub", "Devaraj Urs Road, Mysuru", 12.3070, 76.6480, 4.5, "1800 425 0018", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.9, "$"),
    # Petrol & EV
    ("Mysuru", None, "petrol_bunk", "Indian Oil Super Station & EV Fast Supercharger", "Bannur Road, Siddhartha Layout, Mysuru", 12.3000, 76.6750, 4.7, "+91 821 247 1100", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 3.0, "$$"),
    ("Mysuru", None, "petrol_bunk", "HP Auto Fuelling Station", "Sayyaji Rao Road, Mysuru", 12.3200, 76.6500, 4.6, "+91 821 249 2200", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.8, "$$"),
    # Markets
    ("Mysuru", "Devaraja 130-Year-Old Royal Market", "market", "Devaraja Market Sandalwood, Mysore Silk & Spices", "Sayyaji Rao Road, Mysuru", 12.3090, 76.6520, 4.8, "+91 821 242 1100", "Open Daily (06:30 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.8, "$$"),
    ("Mysuru", None, "market", "Government Silk Weaving Factory & Kaveri Arts Emporium", "Mananthavady Road, Ashokapuram, Mysuru", 12.2850, 76.6450, 4.9, "+91 821 248 1800", "Open Daily (10:00 AM - 08:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 3.5, "$$$"),
    # Rentals
    ("Mysuru", None, "rental", "Royal Mysore Heritage Car & Self-Drive Bike Rental", "Mysore Junction Railway Station", 12.3150, 76.6450, 4.8, "+91 94480 33445", "Open Daily (06:30 AM - 10:00 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 1.5, "$$"),

    # ==========================================
    # 12. MUNNAR SERVICES (22 Services)
    # ==========================================
    # Breakfast
    ("Munnar", None, "restaurant", "Rapsy Restaurant & Warm Morning Pancakes, Omelettes & Coffee", "Main Bazaar, Munnar Town, Kerala", 10.0880, 77.0600, 4.8, "+91 4865 230 456", "Breakfast (07:00 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 0.5, "$"),
    ("Munnar", None, "restaurant", "Hotel Saravana Bhavan Warm Appam with Veg Stew & Filter Coffee", "Old Munnar Town, Kerala", 10.0860, 77.0580, 4.7, "+91 4865 230 789", "Breakfast (06:30 AM - 11:00 AM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.8, "$"),
    ("Munnar", "Tata Tea Museum & Nallathanni Estate", "restaurant", "Tea Tales Cafe Morning Fresh Bakes & Nilgiri Herbal Teas", "Mattupetty Road, Munnar", 10.0920, 77.0650, 4.8, "+91 4865 231 122", "Breakfast (07:30 AM - 11:30 AM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 1.2, "$$"),
    # Lunch
    ("Munnar", None, "restaurant", "Sreemurugan Traditional Kerala Sadhya Meals on Plantain Leaf", "Old Munnar, Kerala", 10.0870, 77.0570, 4.8, "+91 4865 230 999", "Lunch (12:00 PM - 03:45 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.9, "$"),
    ("Munnar", None, "restaurant", "Guru's Restaurant Kerala Fish Curry Meals & Malabar Parotta", "Colony Road, Munnar", 10.0890, 77.0610, 4.7, "+91 4865 231 444", "Lunch (12:30 PM - 04:00 PM)", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", 0.4, "$$"),
    ("Munnar", None, "restaurant", "Saravana Bhavan South Indian Deluxe Thali (Lunch Special)", "AM Road, Munnar", 10.0865, 77.0590, 4.7, "+91 4865 230 111", "Lunch (11:30 AM - 03:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 0.6, "$"),
    # Dinner
    ("Munnar", None, "restaurant", "The Panoramic Getaway Glass-Sky Deck Dinner", "Chithirapuram, Munnar, Kerala", 10.0450, 77.0380, 4.9, "+91 4865 263 888", "Dinner (07:30 PM - 11:00 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 7.5, "$$$$"),
    ("Munnar", "Attukad Waterfalls & Forest Trail", "restaurant", "Blanket Luxury Resort Cliffside Candlelight Dining", "Pallivasal, Munnar", 10.0480, 77.0420, 4.9, "+91 4865 263 456", "Dinner (07:00 PM - 10:45 PM)", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500", 6.8, "$$$$"),
    ("Munnar", "Pothamedu Viewpoint", "restaurant", "Copper Castle Valley View Multicuisine Restaurant", "Pothamedu, Munnar", 10.0570, 77.0500, 4.7, "+91 4865 231 201", "Dinner (07:00 PM - 10:30 PM)", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500", 4.2, "$$$"),
    # Hotels
    ("Munnar", None, "hotel", "Zostel Munnar / Green Valley Backpacker Lodge (Budget Stay)", "Pallivasal / Old Munnar", 10.0520, 77.0480, 4.6, "+91 4865 263 900", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 5.0, "$"),
    ("Munnar", "Pothamedu Viewpoint", "hotel", "Fragrant Nature / Tea Valley Resort (Comfort Stay)", "Pothamedu, Munnar", 10.0590, 77.0520, 4.7, "+91 4865 231 500", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 4.0, "$$"),
    ("Munnar", None, "hotel", "The Panoramic Getaway & Blanket Luxury Resort (Luxury Stay)", "Chithirapuram & Pallivasal, Munnar", 10.0450, 77.0380, 4.9, "+91 4865 263 888", "Open 24/7", "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", 7.5, "$$$$"),
    # Hospitals
    ("Munnar", "Tata Tea Museum & Nallathanni Estate", "hospital", "Tata General Hospital & Emergency Ward (24x7)", "Nullatanni, Munnar, Kerala", 10.0890, 77.0540, 4.8, "+91 4865 230 223", "24x7 Emergency Services", "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=500", 1.8, "$$"),
    ("Munnar", None, "hospital", "High Range Hospital & Medical Emergency Clinic", "Mattupetty Road, Munnar", 10.0910, 77.0630, 4.6, "+91 4865 230 334", "24x7 Emergency", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500", 1.2, "$$"),
    # Police
    ("Munnar", None, "police", "Munnar Police Station & Hill Tourist Safety Assistance", "Devikulam Road, Munnar", 10.0840, 77.0620, 4.7, "+91 4865 230 321 / 100", "24x7 Assistance", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500", 0.9, "$"),
    # ATMs
    ("Munnar", None, "atm", "State Bank of India 24x7 Hilltop ATM", "Old Munnar Main Road", 10.0860, 77.0575, 4.5, "1800 1234", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.8, "$"),
    ("Munnar", None, "atm", "Federal Bank 24/7 ATM & Cash Dispenser", "Main Bazaar, Munnar", 10.0885, 77.0605, 4.5, "1800 420 1199", "Open 24/7", "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=500", 0.4, "$"),
    # Petrol & EV
    ("Munnar", None, "petrol_bunk", "Indian Oil Munnar Fuel Outlet", "Devikulam Road, Munnar", 10.0830, 77.0640, 4.6, "+91 4865 230 400", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 1.0, "$$"),
    ("Munnar", None, "petrol_bunk", "Bharat Petroleum Tea Valley Fuel Station", "Kochi-Dhanushkodi Road, Munnar", 10.0750, 77.0520, 4.5, "+91 4865 231 600", "Open 24 Hours", "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500", 2.2, "$$"),
    # Markets
    ("Munnar", None, "market", "Munnar Town Fresh Spices & Homemade Chocolate Market", "Main Bazaar, Munnar", 10.0880, 77.0600, 4.8, "+91 4865 230 800", "Open Daily (09:00 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.5, "$$"),
    ("Munnar", None, "market", "Abbas & Co. Premium Cardamom, Tea & Hill Spices Depot", "Main Bazaar, Munnar", 10.0875, 77.0610, 4.8, "+91 4865 230 555", "Open Daily (08:30 AM - 09:30 PM)", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=500", 0.6, "$$"),
    # Rentals
    ("Munnar", "Eravikulam National Park & Nilgiri Tahr", "rental", "Munnar 4x4 Off-Road Jeep Safari & Cab Guild", "Old Munnar Bus Stand", 10.0850, 77.0580, 4.8, "+91 94471 22334", "Open Daily (06:00 AM - 08:30 PM)", "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500", 0.8, "$$$")
]

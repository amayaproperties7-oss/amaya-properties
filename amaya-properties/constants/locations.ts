export const MUMBAI_LOCATIONS = {
  "SOUTH MUMBAI": [
    "Colaba", "Nariman Point", "Marine Lines", "Churchgate", "Fort", 
    "Worli", "Malabar Hill", "Tardeo", "Prabhadevi"
  ],
  "WESTERN MUMBAI": [
    "Bandra West", "Khar", "Santacruz", "Juhu", "Andheri", 
    "Versova", "Goregaon", "Malad", "Kandivali", "Borivali"
  ],
  "CENTRAL MUMBAI": [
    "Dadar", "Parel", "Lower Parel", "Byculla", "Sion", 
    "Kurla", "Chembur", "Powai", "Ghatkopar", "Vikhroli"
  ],
  "NAVI MUMBAI": [
    "Vashi", "Nerul", "Belapur", "Airoli", "Ghansoli", 
    "Kharghar", "Taloja", "Ulwe", "Panvel"
  ],
  "THANE REGION": [
    "Thane", "Majiwada", "Kasarvadavali", "Ghodbunder Road", 
    "Dombivli", "Kalyan"
  ]
};

export const ALL_REGIONS = Object.keys(MUMBAI_LOCATIONS);
export const ALL_PLACES = Object.values(MUMBAI_LOCATIONS).flat();

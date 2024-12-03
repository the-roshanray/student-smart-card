const statesAndDistricts = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
  ],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Tezu", "Pasighat"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  Goa: ["Panaji", "Margao", "Mapusa", "Vasco da Gama", "Ponda"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Alappuzha"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  Manipur: ["Imphal", "Bishnupur", "Thoubal", "Churachandpur", "Kakching"],
  Meghalaya: ["Shillong", "Tura", "Nongpoh", "Mairang", "Williamnagar"],
  Mizoram: ["Aizawl", "Lunglei", "Serchhip", "Champhai", "Kolasib"],
  Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rongli"],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
  ],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
  Tripura: ["Agartala", "Udaipur", "Kailashahar", "Dharmanagar", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Haldwani", "Rishikesh"],
  "West Bengal": ["Kolkata", "Durgapur", "Siliguri", "Asansol", "Howrah"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  Chandigarh: ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Silvassa", "Daman", "Diu"],
  Lakshadweep: ["Kavaratti"],
  Delhi: ["New Delhi"],
  Puducherry: ["Puducherry", "Karaikal", "Mahe", "Yanam"],
  Ladakh: ["Leh", "Kargil"],
  Jammu: ["Jammu", "Srinagar", "Anantnag", "Baramulla", "Udhampur"],
};

const coursesAndDepartments = {
  BTech: [
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Electronics and Communication Engineering",
    "Chemical Engineering",
    "Information Technology",
  ],
  MCA: ["Master of Computer Applications"],
  MTech: [
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Electronics and Communication Engineering",
    "Chemical Engineering",
    "Information Technology",
  ],
  BBA: ["Bachelor of Business Administration"],
  MBA: ["Master of Business Administration"],
  BSc: ["Physics", "Chemistry", "Mathematics", "Biotechnology"],
  MSc: ["Physics", "Chemistry", "Mathematics", "Biotechnology"],
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addTwoWeeks() {
  const today = new Date();
  today.setDate(today.getDate() + 14);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const canteenMenu = {
  KHK265: { item: "Dosa", price: 40 },
  LKM134: { item: "Samosa", price: 15 },
  PRM562: { item: "Sandwich", price: 50 },
  BGH241: { item: "Pasta", price: 70 },
  HJG875: { item: "Burger", price: 60 },
  QWE678: { item: "Pizza", price: 100 },
  TYU932: { item: "Salad", price: 45 },
  ZXC457: { item: "Chips", price: 20 },
  ASG753: { item: "Fries", price: 35 },
  XCV982: { item: "Noodles", price: 55 },
  BNM634: { item: "Coke", price: 25 },
  RTY342: { item: "Juice", price: 30 },
  JKL243: { item: "Tea", price: 10 },
  ASD789: { item: "Coffee", price: 20 },
  MNB432: { item: "Biryani", price: 90 },
  QAZ098: { item: "Paratha", price: 25 },
  WSX567: { item: "Paneer Roll", price: 50 },
  EDC321: { item: "Chicken Roll", price: 60 },
  RFV654: { item: "Momos", price: 40 },
  TGB987: { item: "Idli", price: 30 },
  YHN321: { item: "Vada Pav", price: 20 },
  UJM543: { item: "Pakora", price: 15 },
  IKL876: { item: "Pav Bhaji", price: 50 },
  OLK987: { item: "Manchurian", price: 70 },
  POK876: { item: "Fried Rice", price: 60 },
};

const libraryInventory = {
  BK101: { title: "To Kill a Mockingbird" },
  BK102: { title: "1984" },
  BK103: { title: "The Great Gatsby" },
  BK104: { title: "Moby Dick" },
  BK105: { title: "War and Peace" },
  BK106: { title: "Pride and Prejudice" },
  BK107: { title: "The Catcher in the Rye" },
  BK108: { title: "The Hobbit" },
  BK109: { title: "Brave New World" },
  BK110: { title: "Jane Eyre" },
  BK111: { title: "Animal Farm" },
  BK112: { title: "Wuthering Heights" },
  BK113: { title: "The Picture of Dorian Gray" },
  BK114: { title: "Crime and Punishment" },
  BK115: { title: "Frankenstein" },
  BK116: { title: "The Odyssey" },
  BK117: { title: "The Brothers Karamazov" },
  BK118: { title: "Les Misérables" },
  BK119: { title: "Dracula" },
  BK120: { title: "The Divine Comedy" },
};

const stationaryShopInventory = {
  ST101: { name: "Notebook", price: 50 },
  ST102: { name: "Pen", price: 10 },
  ST103: { name: "Pencil", price: 5 },
  ST104: { name: "Eraser", price: 3 },
  ST105: { name: "Ruler", price: 20 },
  ST106: { name: "Marker", price: 15 },
  ST107: { name: "Highlighter", price: 20 },
  ST108: { name: "Stapler", price: 30 },
  ST109: { name: "Glue Stick", price: 25 },
  ST110: { name: "Scissors", price: 40 },
  ST111: { name: "Binder", price: 60 },
  ST112: { name: "Calculator", price: 200 },
  ST113: { name: "Paper Clips", price: 10 },
  ST114: { name: "Sticky Notes", price: 15 },
  ST115: { name: "Folder", price: 35 },
  ST116: { name: "Whiteboard", price: 150 },
  ST117: { name: "Chart Paper", price: 10 },
  ST118: { name: "Drawing Book", price: 60 },
  ST119: { name: "Compass", price: 25 },
  ST120: { name: "Geometry Box", price: 70 },
};

export {
  statesAndDistricts,
  coursesAndDepartments,
  getTodayDate,
  addTwoWeeks,
  canteenMenu,
  libraryInventory,
  stationaryShopInventory,
};

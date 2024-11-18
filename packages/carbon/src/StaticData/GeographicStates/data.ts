import { Country, GeographicStateMap } from "@dashlane/communication";
export type GeographicStateLevelMap = {
  [localeFormat in Country]?: GeographicStateMap;
};
export const GeographicStatesLevel0: GeographicStateLevelMap = {
  [Country.FR]: {
    "FR-0-42": {
      code: "42",
      name: "Alsace",
    },
    "FR-0-72": {
      code: "72",
      name: "Aquitaine",
    },
    "FR-0-83": {
      code: "83",
      name: "Auvergne",
    },
    "FR-0-25": {
      code: "25",
      name: "Basse-Normandie",
    },
    "FR-0-26": {
      code: "26",
      name: "Bourgogne",
    },
    "FR-0-53": {
      code: "53",
      name: "Bretagne",
    },
    "FR-0-24": {
      code: "24",
      name: "Centre",
    },
    "FR-0-21": {
      code: "21",
      name: "Champagne-Ardenne",
    },
    "FR-0-94": {
      code: "94",
      name: "Corse",
    },
    "FR-0-43": {
      code: "43",
      name: "Franche-Comte",
    },
    "FR-0-01": {
      code: "01",
      name: "Guadeloupe",
    },
    "FR-0-03": {
      code: "03",
      name: "Guyane",
    },
    "FR-0-23": {
      code: "23",
      name: "Haute-Normandie",
    },
    "FR-0-11": {
      code: "11",
      name: "Ile-de-France",
    },
    "FR-0-04": {
      code: "04",
      name: "La Reunion",
    },
    "FR-0-91": {
      code: "91",
      name: "Languedoc-Roussillon",
    },
    "FR-0-74": {
      code: "74",
      name: "Limousin",
    },
    "FR-0-41": {
      code: "41",
      name: "Lorraine",
    },
    "FR-0-02": {
      code: "02",
      name: "Martinique",
    },
    "FR-0-73": {
      code: "73",
      name: "Midi-Pyrenees",
    },
    "FR-0-31": {
      code: "31",
      name: "Nord-Pas-de-Calais",
    },
    "FR-0-52": {
      code: "52",
      name: "Pays de la Loire",
    },
    "FR-0-22": {
      code: "22",
      name: "Picardie",
    },
    "FR-0-54": {
      code: "54",
      name: "Poitou-Charentes",
    },
    "FR-0-93": {
      code: "93",
      name: "Provence-Alpes-Cote d'Azur",
    },
    "FR-0-82": {
      code: "82",
      name: "Rhone-Alpes",
    },
  },
  [Country.GB]: {
    "GB-0-67": {
      code: "67",
      name: "Aberdeenshire",
    },
    "GB-0-68": {
      code: "68",
      name: "Angus",
    },
    "GB-0-69": {
      code: "69",
      name: "Antrim",
    },
    "GB-0-70": {
      code: "70",
      name: "Ards",
    },
    "GB-0-71": {
      code: "71",
      name: "Argyll",
    },
    "GB-0-72": {
      code: "72",
      name: "Armagh",
    },
    "GB-0-01": {
      code: "01",
      name: "Avon",
    },
    "GB-0-73": {
      code: "73",
      name: "Ayrshire",
    },
    "GB-0-74": {
      code: "74",
      name: "Ballymena",
    },
    "GB-0-75": {
      code: "75",
      name: "Ballymoney",
    },
    "GB-0-76": {
      code: "76",
      name: "Banbridge",
    },
    "GB-0-77": {
      code: "77",
      name: "Banffshire",
    },
    "GB-0-78": {
      code: "78",
      name: "Bath & NthEstSomerset",
    },
    "GB-0-02": {
      code: "02",
      name: "Bedfordshire",
    },
    "GB-0-79": {
      code: "79",
      name: "Belfast",
    },
    "GB-0-03": {
      code: "03",
      name: "Berkshire",
    },
    "GB-0-80": {
      code: "80",
      name: "Berwickshire",
    },
    "GB-0-81": {
      code: "81",
      name: "Blackburn",
    },
    "GB-0-82": {
      code: "82",
      name: "Blackpool",
    },
    "GB-0-04": {
      code: "04",
      name: "Borders",
    },
    "GB-0-83": {
      code: "83",
      name: "Bournemouth",
    },
    "GB-0-84": {
      code: "84",
      name: "Bracknell Forest",
    },
    "GB-0-85": {
      code: "85",
      name: "Brighton & Hove",
    },
    "GB-0-86": {
      code: "86",
      name: "Bristol",
    },
    "GB-0-05": {
      code: "05",
      name: "Buckinghamshire",
    },
    "GB-0-87": {
      code: "87",
      name: "Caithness",
    },
    "GB-0-06": {
      code: "06",
      name: "Cambridgeshire",
    },
    "GB-0-88": {
      code: "88",
      name: "Carrickfergus",
    },
    "GB-0-89": {
      code: "89",
      name: "Castlereagh",
    },
    "GB-0-07": {
      code: "07",
      name: "Central",
    },
    "GB-0-08": {
      code: "08",
      name: "Cheshire",
    },
    "GB-0-91": {
      code: "91",
      name: "Clackmannanshire",
    },
    "GB-0-12": {
      code: "12",
      name: "Cleveland",
    },
    "GB-0-09": {
      code: "09",
      name: "Clwyd",
    },
    "GB-0-92": {
      code: "92",
      name: "Coleraine",
    },
    "GB-0-93": {
      code: "93",
      name: "Cookstown",
    },
    "GB-0-10": {
      code: "10",
      name: "Cornwall",
    },
    "GB-0-94": {
      code: "94",
      name: "Craigavon",
    },
    "GB-0-11": {
      code: "11",
      name: "Cumbria",
    },
    "GB-0-95": {
      code: "95",
      name: "Darlington",
    },
    "GB-0-13": {
      code: "13",
      name: "Derbyshire",
    },
    "GB-0-16": {
      code: "16",
      name: "Devon",
    },
    "GB-0-14": {
      code: "14",
      name: "Dorset",
    },
    "GB-0-96": {
      code: "96",
      name: "Down",
    },
    "GB-0-97": {
      code: "97",
      name: "Dumfries a. Galloway",
    },
    "GB-0-98": {
      code: "98",
      name: "Dumfriesshire",
    },
    "GB-0-99": {
      code: "99",
      name: "Dunbartonshire",
    },
    "GB-0-100": {
      code: "100",
      name: "Dungannon",
    },
    "GB-0-15": {
      code: "15",
      name: "Durham",
    },
    "GB-0-17": {
      code: "17",
      name: "Dyfed",
    },
    "GB-0-101": {
      code: "101",
      name: "East Lothian",
    },
    "GB-0-102": {
      code: "102",
      name: "East Riding",
    },
    "GB-0-103": {
      code: "103",
      name: "East Sussex",
    },
    "GB-0-18": {
      code: "18",
      name: "Essex",
    },
    "GB-0-104": {
      code: "104",
      name: "Fermanagh",
    },
    "GB-0-19": {
      code: "19",
      name: "Fife",
    },
    "GB-0-20": {
      code: "20",
      name: "Gloucestershire",
    },
    "GB-0-22": {
      code: "22",
      name: "Grampian",
    },
    "GB-0-36": {
      code: "36",
      name: "Greater London",
    },
    "GB-0-21": {
      code: "21",
      name: "Greater Manchester",
    },
    "GB-0-23": {
      code: "23",
      name: "Gwent",
    },
    "GB-0-24": {
      code: "24",
      name: "Gwynedd",
    },
    "GB-0-105": {
      code: "105",
      name: "Halton",
    },
    "GB-0-25": {
      code: "25",
      name: "Hampshire",
    },
    "GB-0-106": {
      code: "106",
      name: "Hartlepool",
    },
    "GB-0-29": {
      code: "29",
      name: "Hereford and Worcs.",
    },
    "GB-0-107": {
      code: "107",
      name: "Herefordshire",
    },
    "GB-0-27": {
      code: "27",
      name: "Hertfordshire",
    },
    "GB-0-108": {
      code: "108",
      name: "Highland",
    },
    "GB-0-28": {
      code: "28",
      name: "Humberside",
    },
    "GB-0-109": {
      code: "109",
      name: "Inverness-Shire",
    },
    "GB-0-110": {
      code: "110",
      name: "Isle Of Arran",
    },
    "GB-0-111": {
      code: "111",
      name: "Isle Of Barra",
    },
    "GB-0-112": {
      code: "112",
      name: "Isle Of Benbecula",
    },
    "GB-0-113": {
      code: "113",
      name: "Isle Of Bute",
    },
    "GB-0-114": {
      code: "114",
      name: "Isle Of Canna",
    },
    "GB-0-115": {
      code: "115",
      name: "Isle Of Coll",
    },
    "GB-0-116": {
      code: "116",
      name: "Isle Of Colonsay",
    },
    "GB-0-117": {
      code: "117",
      name: "Isle Of Cumbrae",
    },
    "GB-0-118": {
      code: "118",
      name: "Isle Of Eigg",
    },
    "GB-0-119": {
      code: "119",
      name: "Isle Of Gigha",
    },
    "GB-0-120": {
      code: "120",
      name: "Isle Of Harris",
    },
    "GB-0-121": {
      code: "121",
      name: "Isle Of Iona",
    },
    "GB-0-122": {
      code: "122",
      name: "Isle Of Islay",
    },
    "GB-0-123": {
      code: "123",
      name: "Isle Of Jura",
    },
    "GB-0-124": {
      code: "124",
      name: "Isle Of Lewis",
    },
    "GB-0-126": {
      code: "126",
      name: "Isle Of Mull",
    },
    "GB-0-127": {
      code: "127",
      name: "Isle Of North Uist",
    },
    "GB-0-128": {
      code: "128",
      name: "Isle Of Rum",
    },
    "GB-0-129": {
      code: "129",
      name: "Isle Of Scalpay",
    },
    "GB-0-131": {
      code: "131",
      name: "Isle Of Skye",
    },
    "GB-0-132": {
      code: "132",
      name: "Isle Of South Uist",
    },
    "GB-0-133": {
      code: "133",
      name: "Isle Of Tiree",
    },
    "GB-0-31": {
      code: "31",
      name: "Isle of Wight",
    },
    "GB-0-130": {
      code: "130",
      name: "Isles Of Scilly",
    },
    "GB-0-32": {
      code: "32",
      name: "Kent",
    },
    "GB-0-134": {
      code: "134",
      name: "Kincardineshire",
    },
    "GB-0-135": {
      code: "135",
      name: "Kingston-Upon-Hull",
    },
    "GB-0-136": {
      code: "136",
      name: "Kirkcudbrightshire",
    },
    "GB-0-137": {
      code: "137",
      name: "Lanarkshire",
    },
    "GB-0-33": {
      code: "33",
      name: "Lancashire",
    },
    "GB-0-138": {
      code: "138",
      name: "Larne",
    },
    "GB-0-139": {
      code: "139",
      name: "Leicester City",
    },
    "GB-0-34": {
      code: "34",
      name: "Leicestershire",
    },
    "GB-0-140": {
      code: "140",
      name: "Limavady",
    },
    "GB-0-35": {
      code: "35",
      name: "Lincolnshire",
    },
    "GB-0-141": {
      code: "141",
      name: "Lisburn",
    },
    "GB-0-142": {
      code: "142",
      name: "London",
    },
    "GB-0-143": {
      code: "143",
      name: "Londonderry",
    },
    "GB-0-37": {
      code: "37",
      name: "Lothian",
    },
    "GB-0-144": {
      code: "144",
      name: "Luton",
    },
    "GB-0-145": {
      code: "145",
      name: "Magherafelt",
    },
    "GB-0-39": {
      code: "39",
      name: "Merseyside",
    },
    "GB-0-38": {
      code: "38",
      name: "Mid Glamorgan",
    },
    "GB-0-146": {
      code: "146",
      name: "Middlesbrough",
    },
    "GB-0-65": {
      code: "65",
      name: "Middlesex",
    },
    "GB-0-147": {
      code: "147",
      name: "Midlothian",
    },
    "GB-0-148": {
      code: "148",
      name: "Milton Keynes",
    },
    "GB-0-149": {
      code: "149",
      name: "Morayshire",
    },
    "GB-0-150": {
      code: "150",
      name: "Moyle",
    },
    "GB-0-151": {
      code: "151",
      name: "Nairn",
    },
    "GB-0-152": {
      code: "152",
      name: "Newbury",
    },
    "GB-0-153": {
      code: "153",
      name: "Newry and Mourne",
    },
    "GB-0-154": {
      code: "154",
      name: "Newtownabbey",
    },
    "GB-0-41": {
      code: "41",
      name: "Norfolk",
    },
    "GB-0-155": {
      code: "155",
      name: "North Down",
    },
    "GB-0-156": {
      code: "156",
      name: "North Humberside",
    },
    "GB-0-157": {
      code: "157",
      name: "North Lincolnshire",
    },
    "GB-0-158": {
      code: "158",
      name: "North Somerset",
    },
    "GB-0-62": {
      code: "62",
      name: "North Yorkshire",
    },
    "GB-0-40": {
      code: "40",
      name: "Northamptonshire",
    },
    "GB-0-43": {
      code: "43",
      name: "Northumberland",
    },
    "GB-0-159": {
      code: "159",
      name: "Nottingham City",
    },
    "GB-0-42": {
      code: "42",
      name: "Nottinghamshire",
    },
    "GB-0-160": {
      code: "160",
      name: "NthEast Lincolnshire",
    },
    "GB-0-161": {
      code: "161",
      name: "Omagh",
    },
    "GB-0-162": {
      code: "162",
      name: "Orkney",
    },
    "GB-0-44": {
      code: "44",
      name: "Oxfordshire",
    },
    "GB-0-163": {
      code: "163",
      name: "Peeblesshire",
    },
    "GB-0-164": {
      code: "164",
      name: "Perthshire",
    },
    "GB-0-165": {
      code: "165",
      name: "Peterborough",
    },
    "GB-0-166": {
      code: "166",
      name: "Plymouth",
    },
    "GB-0-167": {
      code: "167",
      name: "Poole",
    },
    "GB-0-168": {
      code: "168",
      name: "Portsmouth",
    },
    "GB-0-45": {
      code: "45",
      name: "Powys",
    },
    "GB-0-169": {
      code: "169",
      name: "Reading",
    },
    "GB-0-170": {
      code: "170",
      name: "Redcar and Cleveland",
    },
    "GB-0-171": {
      code: "171",
      name: "Renfrewshire",
    },
    "GB-0-172": {
      code: "172",
      name: "Rochester Up. Medway",
    },
    "GB-0-173": {
      code: "173",
      name: "Ross-Shire",
    },
    "GB-0-175": {
      code: "175",
      name: "Roxburghshire",
    },
    "GB-0-176": {
      code: "176",
      name: "Rutland",
    },
    "GB-0-26": {
      code: "26",
      name: "Scotland",
    },
    "GB-0-177": {
      code: "177",
      name: "Shetland",
    },
    "GB-0-48": {
      code: "48",
      name: "Shropshire",
    },
    "GB-0-178": {
      code: "178",
      name: "Slough",
    },
    "GB-0-50": {
      code: "50",
      name: "Somerset",
    },
    "GB-0-47": {
      code: "47",
      name: "South Glamorgan",
    },
    "GB-0-179": {
      code: "179",
      name: "South Humberside",
    },
    "GB-0-63": {
      code: "63",
      name: "South Yorkshire",
    },
    "GB-0-180": {
      code: "180",
      name: "Southampton",
    },
    "GB-0-181": {
      code: "181",
      name: "Southend",
    },
    "GB-0-51": {
      code: "51",
      name: "Staffordshire",
    },
    "GB-0-182": {
      code: "182",
      name: "Sth. Gloucestershire",
    },
    "GB-0-183": {
      code: "183",
      name: "Stirlingshire",
    },
    "GB-0-184": {
      code: "184",
      name: "Stockton-on-Tees",
    },
    "GB-0-185": {
      code: "185",
      name: "Strabane",
    },
    "GB-0-46": {
      code: "46",
      name: "Strathclyde",
    },
    "GB-0-49": {
      code: "49",
      name: "Suffolk",
    },
    "GB-0-53": {
      code: "53",
      name: "Surrey",
    },
    "GB-0-52": {
      code: "52",
      name: "Sussex",
    },
    "GB-0-186": {
      code: "186",
      name: "Sutherland",
    },
    "GB-0-54": {
      code: "54",
      name: "Tayside",
    },
    "GB-0-187": {
      code: "187",
      name: "Thamesdown",
    },
    "GB-0-188": {
      code: "188",
      name: "Thurrock",
    },
    "GB-0-189": {
      code: "189",
      name: "Torbay",
    },
    "GB-0-55": {
      code: "55",
      name: "Tyne and Wear",
    },
    "GB-0-190": {
      code: "190",
      name: "Tyrone",
    },
    "GB-0-191": {
      code: "191",
      name: "Warrington",
    },
    "GB-0-56": {
      code: "56",
      name: "Warwickshire",
    },
    "GB-0-57": {
      code: "57",
      name: "West Glamorgan",
    },
    "GB-0-192": {
      code: "192",
      name: "West Lothian",
    },
    "GB-0-59": {
      code: "59",
      name: "West Midlands",
    },
    "GB-0-193": {
      code: "193",
      name: "West Sussex",
    },
    "GB-0-64": {
      code: "64",
      name: "West Yorkshire",
    },
    "GB-0-194": {
      code: "194",
      name: "Western Isles",
    },
    "GB-0-195": {
      code: "195",
      name: "Wigtownshire",
    },
    "GB-0-58": {
      code: "58",
      name: "Wiltshire",
    },
    "GB-0-196": {
      code: "196",
      name: "Windsor & Maidenhead",
    },
    "GB-0-197": {
      code: "197",
      name: "Wokingham",
    },
    "GB-0-60": {
      code: "60",
      name: "Worcestershire",
    },
    "GB-0-198": {
      code: "198",
      name: "Wrekin",
    },
    "GB-0-199": {
      code: "199",
      name: "York",
    },
    "GB-0-61": {
      code: "61",
      name: "Yorkshire",
    },
    "GB-0-1001": {
      code: "1001",
      name: "Blaenau Gwent",
    },
    "GB-0-1002": {
      code: "1002",
      name: "Bridgend",
    },
    "GB-0-1003": {
      code: "1003",
      name: "Caerphilly",
    },
    "GB-0-1004": {
      code: "1004",
      name: "Cardiff",
    },
    "GB-0-1005": {
      code: "1005",
      name: "Carmarthenshire",
    },
    "GB-0-1006": {
      code: "1006",
      name: "Ceredigion",
    },
    "GB-0-1007": {
      code: "1007",
      name: "Channel Islands",
    },
    "GB-0-1008": {
      code: "1008",
      name: "Conwy",
    },
    "GB-0-1009": {
      code: "1009",
      name: "Denbighshire",
    },
    "GB-0-1010": {
      code: "1010",
      name: "East Ayrshire",
    },
    "GB-0-1011": {
      code: "1011",
      name: "East Dunbartonshire",
    },
    "GB-0-1012": {
      code: "1012",
      name: "East Renfrewshire",
    },
    "GB-0-1013": {
      code: "1013",
      name: "Edinburgh City",
    },
    "GB-0-1014": {
      code: "1014",
      name: "Falkirk",
    },
    "GB-0-1015": {
      code: "1015",
      name: "Flintshire",
    },
    "GB-0-1016": {
      code: "1016",
      name: "Glasgow",
    },
    "GB-0-1017": {
      code: "1017",
      name: "Inverclyde",
    },
    "GB-0-1018": {
      code: "1018",
      name: "Isle of Anglesey",
    },
    "GB-0-1019": {
      code: "1019",
      name: "Isle of Man",
    },
    "GB-0-1020": {
      code: "1020",
      name: "Merthyr Tydfil",
    },
    "GB-0-1021": {
      code: "1021",
      name: "Monmouthshire",
    },
    "GB-0-1022": {
      code: "1022",
      name: "Moray",
    },
    "GB-0-1023": {
      code: "1023",
      name: "Neath Port Talbot",
    },
    "GB-0-1024": {
      code: "1024",
      name: "Newport",
    },
    "GB-0-1025": {
      code: "1025",
      name: "North Ayrshire",
    },
    "GB-0-1026": {
      code: "1026",
      name: "North Lanarkshire",
    },
    "GB-0-1027": {
      code: "1027",
      name: "Pembrokeshire",
    },
    "GB-0-1028": {
      code: "1028",
      name: "Rhondda Cynon Taff",
    },
    "GB-0-1029": {
      code: "1029",
      name: "South Ayrshire",
    },
    "GB-0-1030": {
      code: "1030",
      name: "South Lanarkshire",
    },
    "GB-0-1031": {
      code: "1031",
      name: "Stirling",
    },
    "GB-0-1032": {
      code: "1032",
      name: "Swansea",
    },
    "GB-0-1033": {
      code: "1033",
      name: "The Vale of Glamorgan",
    },
    "GB-0-1034": {
      code: "1034",
      name: "Torfaen",
    },
    "GB-0-1035": {
      code: "1035",
      name: "West Dunbartonshire",
    },
    "GB-0-1036": {
      code: "1036",
      name: "Wrexham",
    },
  },
  [Country.US]: {
    "US-0-AL": {
      code: "AL",
      name: "Alabama",
    },
    "US-0-AK": {
      code: "AK",
      name: "Alaska",
    },
    "US-0-AS": {
      code: "AS",
      name: "American Samoa",
    },
    "US-0-AZ": {
      code: "AZ",
      name: "Arizona",
    },
    "US-0-AR": {
      code: "AR",
      name: "Arkansas",
    },
    "US-0-AA": {
      code: "AA",
      name: "Armed Forces America",
    },
    "US-0-AE": {
      code: "AE",
      name: "Armed Forces Europe",
    },
    "US-0-AP": {
      code: "AP",
      name: "Armed Forces Pacific",
    },
    "US-0-CA": {
      code: "CA",
      name: "California",
    },
    "US-0-CEI": {
      code: "CEI",
      name: "Canton & Enderbury Islands",
    },
    "US-0-CO": {
      code: "CO",
      name: "Colorado",
    },
    "US-0-CT": {
      code: "CT",
      name: "Connecticut",
    },
    "US-0-DC": {
      code: "DC",
      name: "District of Columbia",
    },
    "US-0-DE": {
      code: "DE",
      name: "Delaware",
    },
    "US-0-FL": {
      code: "FL",
      name: "Florida",
    },
    "US-0-GA": {
      code: "GA",
      name: "Georgia",
    },
    "US-0-GU": {
      code: "GU",
      name: "Guam",
    },
    "US-0-HI": {
      code: "HI",
      name: "Hawaii",
    },
    "US-0-IA": {
      code: "IA",
      name: "Iowa",
    },
    "US-0-ID": {
      code: "ID",
      name: "Idaho",
    },
    "US-0-IL": {
      code: "IL",
      name: "Illinois",
    },
    "US-0-IN": {
      code: "IN",
      name: "Indiana",
    },
    "US-0-KS": {
      code: "KS",
      name: "Kansas",
    },
    "US-0-KY": {
      code: "KY",
      name: "Kentucky",
    },
    "US-0-LA": {
      code: "LA",
      name: "Louisiana",
    },
    "US-0-MA": {
      code: "MA",
      name: "Massachusetts",
    },
    "US-0-MD": {
      code: "MD",
      name: "Maryland",
    },
    "US-0-ME": {
      code: "ME",
      name: "Maine",
    },
    "US-0-MP": {
      code: "MP",
      name: "Mariana Islands",
    },
    "US-0-MI": {
      code: "MI",
      name: "Michigan",
    },
    "US-0-MN": {
      code: "MN",
      name: "Minnesota",
    },
    "US-0-MS": {
      code: "MS",
      name: "Mississippi",
    },
    "US-0-MO": {
      code: "MO",
      name: "Missouri",
    },
    "US-0-MT": {
      code: "MT",
      name: "Montana",
    },
    "US-0-NE": {
      code: "NE",
      name: "Nebraska",
    },
    "US-0-NV": {
      code: "NV",
      name: "Nevada",
    },
    "US-0-NH": {
      code: "NH",
      name: "New Hampshire",
    },
    "US-0-NJ": {
      code: "NJ",
      name: "New Jersey",
    },
    "US-0-NM": {
      code: "NM",
      name: "New Mexico",
    },
    "US-0-NY": {
      code: "NY",
      name: "New York",
    },
    "US-0-NC": {
      code: "NC",
      name: "North Carolina",
    },
    "US-0-ND": {
      code: "ND",
      name: "North Dakota",
    },
    "US-0-NMI": {
      code: "NMI",
      name: "North Mariana Islands",
    },
    "US-0-OH": {
      code: "OH",
      name: "Ohio",
    },
    "US-0-OK": {
      code: "OK",
      name: "Oklahoma",
    },
    "US-0-OR": {
      code: "OR",
      name: "Oregon",
    },
    "US-0-PW": {
      code: "PW",
      name: "Palau",
    },
    "US-0-PA": {
      code: "PA",
      name: "Pennsylvania",
    },
    "US-0-PR": {
      code: "PR",
      name: "Puerto Rico",
    },
    "US-0-RI": {
      code: "RI",
      name: "Rhode Island",
    },
    "US-0-SC": {
      code: "SC",
      name: "South Carolina",
    },
    "US-0-SD": {
      code: "SD",
      name: "South Dakota",
    },
    "US-0-TN": {
      code: "TN",
      name: "Tennessee",
    },
    "US-0-TX": {
      code: "TX",
      name: "Texas",
    },
    "US-0-UT": {
      code: "UT",
      name: "Utah",
    },
    "US-0-VT": {
      code: "VT",
      name: "Vermont",
    },
    "US-0-VI": {
      code: "VI",
      name: "Virgin Islands, US",
    },
    "US-0-VA": {
      code: "VA",
      name: "Virginia",
    },
    "US-0-WA": {
      code: "WA",
      name: "Washington",
    },
    "US-0-WV": {
      code: "WV",
      name: "West Virginia",
    },
    "US-0-WI": {
      code: "WI",
      name: "Wisconsin",
    },
    "US-0-WY": {
      code: "WY",
      name: "Wyoming",
    },
  },
  [Country.CA]: {
    "CA-0-AB": {
      code: "AB",
      name: "Alberta",
    },
    "CA-0-BC": {
      code: "BC",
      name: "British Columbia",
    },
    "CA-0-MB": {
      code: "MB",
      name: "Manitoba",
    },
    "CA-0-NB": {
      code: "NB",
      name: "New Brunswick",
    },
    "CA-0-NL": {
      code: "NL",
      name: "Newfoundland and Labrador",
    },
    "CA-0-NS": {
      code: "NS",
      name: "Nova Scotia",
    },
    "CA-0-NT": {
      code: "NT",
      name: "Northwest Territories",
    },
    "CA-0-NU": {
      code: "NU",
      name: "Nunavut",
    },
    "CA-0-ON": {
      code: "ON",
      name: "Ontario",
    },
    "CA-0-PE": {
      code: "PE",
      name: "Prince Edward Island",
    },
    "CA-0-QC": {
      code: "QC",
      name: "Québec",
    },
    "CA-0-SK": {
      code: "SK",
      name: "Saskatchewan",
    },
    "CA-0-YT": {
      code: "YT",
      name: "Yukon",
    },
  },
  [Country.AU]: {
    "AU-0-SA": {
      code: "SA",
      name: "South Australia",
    },
    "AU-0-WA": {
      code: "WA",
      name: "Western Australia",
    },
    "AU-0-NSW": {
      code: "NSW",
      name: "New South Wales",
    },
    "AU-0-QLD": {
      code: "QLD",
      name: "Queensland",
    },
    "AU-0-TAS": {
      code: "TAS",
      name: "Tasmania",
    },
    "AU-0-VIC": {
      code: "VIC",
      name: "Victoria",
    },
    "AU-0-ACT": {
      code: "ACT",
      name: "Australian Capital Territory",
    },
    "AU-0-JBT": {
      code: "JBT",
      name: "Jervis Bay Territory",
    },
    "AU-0-NT": {
      code: "NT",
      name: "Northern Territory",
    },
  },
  [Country.IE]: {
    "IE-0-05": {
      code: "05",
      name: "Carlow",
    },
    "IE-0-04": {
      code: "04",
      name: "Clare",
    },
    "IE-0-03": {
      code: "03",
      name: "Cork",
    },
    "IE-0-07": {
      code: "07",
      name: "Donegal",
    },
    "IE-0-06": {
      code: "06",
      name: "Dublin",
    },
    "IE-0-10": {
      code: "10",
      name: "Galway",
    },
    "IE-0-13": {
      code: "13",
      name: "Cavan",
    },
    "IE-0-14": {
      code: "14",
      name: "Kerry",
    },
    "IE-0-11": {
      code: "11",
      name: "Kildare",
    },
    "IE-0-12": {
      code: "12",
      name: "Kilkenny",
    },
    "IE-0-19": {
      code: "19",
      name: "Laois",
    },
    "IE-0-18": {
      code: "18",
      name: "Leitrim",
    },
    "IE-0-17": {
      code: "17",
      name: "Limerick",
    },
    "IE-0-16": {
      code: "16",
      name: "Longford",
    },
    "IE-0-20": {
      code: "20",
      name: "Louth",
    },
    "IE-0-23": {
      code: "23",
      name: "Mayo",
    },
    "IE-0-22": {
      code: "22",
      name: "Meath",
    },
    "IE-0-21": {
      code: "21",
      name: "Monaghan",
    },
    "IE-0-24": {
      code: "24",
      name: "Offaly",
    },
    "IE-0-25": {
      code: "25",
      name: "Roscommon",
    },
    "IE-0-26": {
      code: "26",
      name: "Sligo",
    },
    "IE-0-27": {
      code: "27",
      name: "Tipperary",
    },
    "IE-0-29": {
      code: "29",
      name: "Waterford",
    },
    "IE-0-31": {
      code: "31",
      name: "Westmeath",
    },
    "IE-0-32": {
      code: "32",
      name: "Wexford",
    },
    "IE-0-30": {
      code: "30",
      name: "Wicklow",
    },
  },
  [Country.ES]: {
    "ES-0-AN": {
      code: "AN",
      name: "Andalucia",
    },
    "ES-0-AR": {
      code: "AR",
      name: "Aragón",
    },
    "ES-0-AS": {
      code: "AS",
      name: "Asturias, Principado de",
    },
    "ES-0-CN": {
      code: "CN",
      name: "Canarias",
    },
    "ES-0-CB": {
      code: "CB",
      name: "Cantabria",
    },
    "ES-0-CM": {
      code: "CM",
      name: "Castilla-La Mancha",
    },
    "ES-0-CL": {
      code: "CL",
      name: "Castilla y León",
    },
    "ES-0-CT": {
      code: "CT",
      name: "Cataluña",
    },
    "ES-0-EX": {
      code: "EX",
      name: "Extremadura",
    },
    "ES-0-GA": {
      code: "GA",
      name: "Galicia",
    },
    "ES-0-IB": {
      code: "IB",
      name: "Illes Balears",
    },
    "ES-0-RI": {
      code: "RI",
      name: "La Rioja",
    },
    "ES-0-MD": {
      code: "MD",
      name: "Madrid, Comunidad de",
    },
    "ES-0-MC": {
      code: "MC",
      name: "Murcia, Región de",
    },
    "ES-0-NC": {
      code: "NC",
      name: "Navarra, Comunidad Foral de",
    },
    "ES-0-PV": {
      code: "PV",
      name: "País Vasco",
    },
    "ES-0-VC": {
      code: "VC",
      name: "Valenciana, Comunitat",
    },
    "ES-0-CE": {
      code: "CE",
      name: "Ceuta",
    },
    "ES-0-ML": {
      code: "ML",
      name: "Melilla",
    },
  },
  [Country.MX]: {
    "MX-0-DIF": {
      code: "DIF",
      name: "Distrito Federal",
    },
    "MX-0-AGU": {
      code: "AGU",
      name: "Aguascalientes",
    },
    "MX-0-BCN": {
      code: "BCN",
      name: "Baja California",
    },
    "MX-0-BCS": {
      code: "BCS",
      name: "Baja California Sur",
    },
    "MX-0-CAM": {
      code: "CAM",
      name: "Campeche",
    },
    "MX-0-COA": {
      code: "COA",
      name: "Coahuila",
    },
    "MX-0-COL": {
      code: "COL",
      name: "Colima",
    },
    "MX-0-CHP": {
      code: "CHP",
      name: "Chiapas",
    },
    "MX-0-CHH": {
      code: "CHH",
      name: "Chihuahua",
    },
    "MX-0-DUR": {
      code: "DUR",
      name: "Durango",
    },
    "MX-0-GUA": {
      code: "GUA",
      name: "Guanajuato",
    },
    "MX-0-GRO": {
      code: "GRO",
      name: "Guerrero",
    },
    "MX-0-HID": {
      code: "HID",
      name: "Hidalgo",
    },
    "MX-0-JAL": {
      code: "JAL",
      name: "Jalisco",
    },
    "MX-0-MEX": {
      code: "MEX",
      name: "México",
    },
    "MX-0-MIC": {
      code: "MIC",
      name: "Michoacán",
    },
    "MX-0-MOR": {
      code: "MOR",
      name: "Morelos",
    },
    "MX-0-NAY": {
      code: "NAY",
      name: "Nayarit",
    },
    "MX-0-NLE": {
      code: "NLE",
      name: "Nuevo León",
    },
    "MX-0-OAX": {
      code: "OAX",
      name: "Oaxaca",
    },
    "MX-0-PUE": {
      code: "PUE",
      name: "Puebla",
    },
    "MX-0-QUE": {
      code: "QUE",
      name: "Querétaro",
    },
    "MX-0-ROO": {
      code: "ROO",
      name: "Quintana Roo",
    },
    "MX-0-SLP": {
      code: "SLP",
      name: "San Luis Potosí",
    },
    "MX-0-SIN": {
      code: "SIN",
      name: "Sinaloa",
    },
    "MX-0-SON": {
      code: "SON",
      name: "Sonora",
    },
    "MX-0-TAB": {
      code: "TAB",
      name: "Tabasco",
    },
    "MX-0-TAM": {
      code: "TAM",
      name: "Tamaulipas",
    },
    "MX-0-TLA": {
      code: "TLA",
      name: "Tlaxcala",
    },
    "MX-0-VER": {
      code: "VER",
      name: "Veracruz",
    },
    "MX-0-YUC": {
      code: "YUC",
      name: "Yucatán",
    },
    "MX-0-ZAC": {
      code: "ZAC",
      name: "Zacatecas",
    },
  },
  [Country.CO]: {
    "CO-0-DC": {
      code: "DC",
      name: "Distrito Capital de Bogotá",
    },
    "CO-0-AMA": {
      code: "AMA",
      name: "Amazonas",
    },
    "CO-0-ANT": {
      code: "ANT",
      name: "Antioquia",
    },
    "CO-0-ARA": {
      code: "ARA",
      name: "Arauca",
    },
    "CO-0-ATL": {
      code: "ATL",
      name: "Atlántico",
    },
    "CO-0-BOL": {
      code: "BOL",
      name: "Bolívar",
    },
    "CO-0-BOY": {
      code: "BOY",
      name: "Boyacá",
    },
    "CO-0-CAL": {
      code: "CAL",
      name: "Caldas",
    },
    "CO-0-CAQ": {
      code: "CAQ",
      name: "Caquetá",
    },
    "CO-0-CAS": {
      code: "CAS",
      name: "Casanare",
    },
    "CO-0-CAU": {
      code: "CAU",
      name: "Cauca",
    },
    "CO-0-CES": {
      code: "CES",
      name: "Cesar",
    },
    "CO-0-COR": {
      code: "COR",
      name: "Córdoba",
    },
    "CO-0-CUN": {
      code: "CUN",
      name: "Cundinamarca",
    },
    "CO-0-CHO": {
      code: "CHO",
      name: "Chocó",
    },
    "CO-0-GUA": {
      code: "GUA",
      name: "Guainía",
    },
    "CO-0-GUV": {
      code: "GUV",
      name: "Guaviare",
    },
    "CO-0-HUI": {
      code: "HUI",
      name: "Huila",
    },
    "CO-0-LAG": {
      code: "LAG",
      name: "*****",
    },
    "CO-0-MAG": {
      code: "MAG",
      name: "Magdalena",
    },
    "CO-0-MET": {
      code: "MET",
      name: "Meta",
    },
    "CO-0-NAR": {
      code: "NAR",
      name: "Nariño",
    },
    "CO-0-NSA": {
      code: "NSA",
      name: "Norte de Santander",
    },
    "CO-0-PUT": {
      code: "PUT",
      name: "Putumayo",
    },
    "CO-0-QUI": {
      code: "QUI",
      name: "Quindío",
    },
    "CO-0-RIS": {
      code: "RIS",
      name: "Risaralda",
    },
    "CO-0-SAP": {
      code: "SAP",
      name: "San Andrés, Providencia y Santa Catalina",
    },
    "CO-0-SAN": {
      code: "SAN",
      name: "Santander",
    },
    "CO-0-SUC": {
      code: "SUC",
      name: "Sucre",
    },
    "CO-0-TOL": {
      code: "TOL",
      name: "Tolima",
    },
    "CO-0-VAC": {
      code: "VAC",
      name: "Valle del Cauca",
    },
    "CO-0-VAU": {
      code: "VAU",
      name: "Vaupés",
    },
    "CO-0-VID": {
      code: "VID",
      name: "Vichada",
    },
  },
  [Country.PE]: {
    "PE-0-CAL": {
      code: "CAL",
      name: "El Callao",
    },
    "PE-0-LMA": {
      code: "LMA",
      name: "Municipalidad Metropolitana de Lima",
    },
    "PE-0-AMA": {
      code: "AMA",
      name: "Amazonas",
    },
    "PE-0-ANC": {
      code: "ANC",
      name: "Ancash",
    },
    "PE-0-APU": {
      code: "APU",
      name: "Apurímac",
    },
    "PE-0-ARE": {
      code: "ARE",
      name: "Arequipa",
    },
    "PE-0-AYA": {
      code: "AYA",
      name: "Ayacucho",
    },
    "PE-0-CAJ": {
      code: "CAJ",
      name: "Cajamarca",
    },
    "PE-0-CUS": {
      code: "CUS",
      name: "Cusco",
    },
    "PE-0-HUV": {
      code: "HUV",
      name: "Huancavelica",
    },
    "PE-0-HUC": {
      code: "HUC",
      name: "Huánuco",
    },
    "PE-0-ICA": {
      code: "ICA",
      name: "Ica",
    },
    "PE-0-JUN": {
      code: "JUN",
      name: "Junín",
    },
    "PE-0-LAL": {
      code: "LAL",
      name: "La Libertad",
    },
    "PE-0-LAM": {
      code: "LAM",
      name: "Lambayeque",
    },
    "PE-0-LIM": {
      code: "LIM",
      name: "Lima",
    },
    "PE-0-LOR": {
      code: "LOR",
      name: "Loreto",
    },
    "PE-0-MDD": {
      code: "MDD",
      name: "Madre de Dios",
    },
    "PE-0-MOQ": {
      code: "MOQ",
      name: "Moquegua",
    },
    "PE-0-PAS": {
      code: "PAS",
      name: "Pasco",
    },
    "PE-0-PIU": {
      code: "PIU",
      name: "Piura",
    },
    "PE-0-PUN": {
      code: "PUN",
      name: "Puno",
    },
    "PE-0-SAM": {
      code: "SAM",
      name: "San Martín",
    },
    "PE-0-TAC": {
      code: "TAC",
      name: "Tacna",
    },
    "PE-0-TUM": {
      code: "TUM",
      name: "Tumbes",
    },
    "PE-0-UCA": {
      code: "UCA",
      name: "Ucayali",
    },
  },
  [Country.CL]: {
    "CL-0-AI": {
      code: "AI",
      name: "Aisén del General Carlos Ibañez del Campo",
    },
    "CL-0-AN": {
      code: "AN",
      name: "Antofagasta",
    },
    "CL-0-AR": {
      code: "AR",
      name: "Araucanía",
    },
    "CL-0-AP": {
      code: "AP",
      name: "Arica y Parinacota",
    },
    "CL-0-AT": {
      code: "AT",
      name: "Atacama",
    },
    "CL-0-BI": {
      code: "BI",
      name: "Biobío",
    },
    "CL-0-CO": {
      code: "CO",
      name: "Coquimbo",
    },
    "CL-0-LI": {
      code: "LI",
      name: "Libertador General Bernardo O'Higgins",
    },
    "CL-0-LL": {
      code: "LL",
      name: "Los Lagos",
    },
    "CL-0-LR": {
      code: "LR",
      name: "Los Ríos",
    },
    "CL-0-MA": {
      code: "MA",
      name: "Magallanes y la Antártica Chilena",
    },
    "CL-0-ML": {
      code: "ML",
      name: "Maule",
    },
    "CL-0-RM": {
      code: "RM",
      name: "Metropolitana de Santiago",
    },
    "CL-0-TA": {
      code: "TA",
      name: "Tarapacá",
    },
    "CL-0-VS": {
      code: "VS",
      name: "Valparaíso",
    },
  },
  [Country.DE]: {
    "DE-0-BW": {
      code: "BW",
      name: "Baden-Württemberg",
    },
    "DE-0-BY": {
      code: "BY",
      name: "Bayern",
    },
    "DE-0-BE": {
      code: "BE",
      name: "Berlin",
    },
    "DE-0-BB": {
      code: "BB",
      name: "Brandenburg",
    },
    "DE-0-HB": {
      code: "HB",
      name: "Bremen",
    },
    "DE-0-HH": {
      code: "HH",
      name: "Hamburg",
    },
    "DE-0-HE": {
      code: "HE",
      name: "Hessen",
    },
    "DE-0-MV": {
      code: "MV",
      name: "Mecklenburg-Vorpommern",
    },
    "DE-0-NI": {
      code: "NI",
      name: "Niedersachsen",
    },
    "DE-0-NW": {
      code: "NW",
      name: "Nordrhein-Westfalen",
    },
    "DE-0-RP": {
      code: "RP",
      name: "Rheinland-Pfalz",
    },
    "DE-0-SL": {
      code: "SL",
      name: "Saarland",
    },
    "DE-0-SN": {
      code: "SN",
      name: "Sachsen",
    },
    "DE-0-ST": {
      code: "ST",
      name: "Sachsen-Anhalt",
    },
    "DE-0-SH": {
      code: "SH",
      name: "Schleswig-Holstein",
    },
    "DE-0-TH": {
      code: "TH",
      name: "Thüringen",
    },
  },
  [Country.IT]: {
    "IT-0-65": {
      code: "65",
      name: "Abruzzo",
    },
    "IT-0-77": {
      code: "77",
      name: "Basilicata",
    },
    "IT-0-78": {
      code: "78",
      name: "Calabria",
    },
    "IT-0-72": {
      code: "72",
      name: "Campania",
    },
    "IT-0-45": {
      code: "45",
      name: "Emilia-Romagna",
    },
    "IT-0-36": {
      code: "36",
      name: "Friuli-Venezia Giulia",
    },
    "IT-0-62": {
      code: "62",
      name: "Lazio",
    },
    "IT-0-42": {
      code: "42",
      name: "Liguria",
    },
    "IT-0-25": {
      code: "25",
      name: "Lombardia",
    },
    "IT-0-57": {
      code: "57",
      name: "Marche",
    },
    "IT-0-67": {
      code: "67",
      name: "Molise",
    },
    "IT-0-21": {
      code: "21",
      name: "Piemonte",
    },
    "IT-0-75": {
      code: "75",
      name: "Puglia",
    },
    "IT-0-88": {
      code: "88",
      name: "Sardegna",
    },
    "IT-0-82": {
      code: "82",
      name: "Sicilia",
    },
    "IT-0-52": {
      code: "52",
      name: "Toscana",
    },
    "IT-0-32": {
      code: "32",
      name: "Trentino Alto Adige",
    },
    "IT-0-55": {
      code: "55",
      name: "Umbria",
    },
    "IT-0-23": {
      code: "23",
      name: "Valle d'Aosta",
    },
    "IT-0-34": {
      code: "34",
      name: "Veneto",
    },
  },
  [Country.CH]: {
    "CH-0-AG": {
      code: "AG",
      name: "Aargau",
    },
    "CH-0-AR": {
      code: "AR",
      name: "Appenzell Ausserrhoden",
    },
    "CH-0-AI": {
      code: "AI",
      name: "Appenzell Innerrhoden",
    },
    "CH-0-BL": {
      code: "BL",
      name: "Basel-Landschaft",
    },
    "CH-0-BS": {
      code: "BS",
      name: "Basel-Stadt",
    },
    "CH-0-BE": {
      code: "BE",
      name: "Berne",
    },
    "CH-0-FR": {
      code: "FR",
      name: "Fribourg",
    },
    "CH-0-GE": {
      code: "GE",
      name: "Genève",
    },
    "CH-0-GL": {
      code: "GL",
      name: "Glarus",
    },
    "CH-0-GR": {
      code: "GR",
      name: "Graubünden",
    },
    "CH-0-JU": {
      code: "JU",
      name: "Jura",
    },
    "CH-0-LU": {
      code: "LU",
      name: "Luzern",
    },
    "CH-0-NE": {
      code: "NE",
      name: "Neuchâtel",
    },
    "CH-0-NW": {
      code: "NW",
      name: "Nidwalden",
    },
    "CH-0-OW": {
      code: "OW",
      name: "Obwalden",
    },
    "CH-0-SG": {
      code: "SG",
      name: "Sankt Gallen",
    },
    "CH-0-SH": {
      code: "SH",
      name: "Schaffhausen",
    },
    "CH-0-SZ": {
      code: "SZ",
      name: "Schwyz",
    },
    "CH-0-SO": {
      code: "SO",
      name: "Solothurn",
    },
    "CH-0-TG": {
      code: "TG",
      name: "Thurgau",
    },
    "CH-0-TI": {
      code: "TI",
      name: "Ticino",
    },
    "CH-0-UR": {
      code: "UR",
      name: "Uri",
    },
    "CH-0-VS": {
      code: "VS",
      name: "Valais",
    },
    "CH-0-VD": {
      code: "VD",
      name: "Vaud",
    },
    "CH-0-ZG": {
      code: "ZG",
      name: "Zug",
    },
    "CH-0-ZH": {
      code: "ZH",
      name: "Zürich",
    },
  },
  [Country.BE]: {
    "BE-0-BRU": {
      code: "BRU",
      name: "Bruxelles-Capitale, Région de",
    },
    "BE-0-VLG": {
      code: "VLG",
      name: "Vlaamse Gewest",
    },
    "BE-0-WAL": {
      code: "WAL",
      name: "Région wallonne",
    },
  },
  [Country.SE]: {
    "SE-0-K": {
      code: "K",
      name: "Blekinge län",
    },
    "SE-0-W": {
      code: "W",
      name: "Dalarnas län",
    },
    "SE-0-I": {
      code: "I",
      name: "Gotlands län",
    },
    "SE-0-X": {
      code: "X",
      name: "Gävleborgs län",
    },
    "SE-0-N": {
      code: "N",
      name: "Hallands län",
    },
    "SE-0-Z": {
      code: "Z",
      name: "Jämtlands län",
    },
    "SE-0-F": {
      code: "F",
      name: "Jönköpings län",
    },
    "SE-0-H": {
      code: "H",
      name: "Kalmar län",
    },
    "SE-0-G": {
      code: "G",
      name: "Kronobergs län",
    },
    "SE-0-BD": {
      code: "BD",
      name: "Norrbottens län",
    },
    "SE-0-M": {
      code: "M",
      name: "Skåne län",
    },
    "SE-0-AB": {
      code: "AB",
      name: "Stockholms län",
    },
    "SE-0-D": {
      code: "D",
      name: "Södermanlands län",
    },
    "SE-0-C": {
      code: "C",
      name: "Uppsala län",
    },
    "SE-0-S": {
      code: "S",
      name: "Värmlands län",
    },
    "SE-0-AC": {
      code: "AC",
      name: "Västerbottens län",
    },
    "SE-0-Y": {
      code: "Y",
      name: "Västernorrlands län",
    },
    "SE-0-U": {
      code: "U",
      name: "Västmanlands län",
    },
    "SE-0-O": {
      code: "O",
      name: "Västra Götalands län",
    },
    "SE-0-T": {
      code: "T",
      name: "Örebro län",
    },
    "SE-0-E": {
      code: "E",
      name: "Östergötlands län",
    },
  },
  [Country.NO]: {
    "NO-0-2": {
      code: "2",
      name: "Akershus",
    },
    "NO-0-9": {
      code: "9",
      name: "Aust-Agder",
    },
    "NO-0-6": {
      code: "6",
      name: "Buskerud",
    },
    "NO-0-20": {
      code: "20",
      name: "Finnmark",
    },
    "NO-0-4": {
      code: "4",
      name: "Hedmark",
    },
    "NO-0-12": {
      code: "12",
      name: "Hordaland",
    },
    "NO-0-15": {
      code: "15",
      name: "Møre og Romsdal",
    },
    "NO-0-18": {
      code: "18",
      name: "Nordland",
    },
    "NO-0-17": {
      code: "17",
      name: "Nord-Trøndelag",
    },
    "NO-0-5": {
      code: "5",
      name: "Oppland",
    },
    "NO-0-3": {
      code: "3",
      name: "Oslo",
    },
    "NO-0-11": {
      code: "11",
      name: "Rogaland",
    },
    "NO-0-14": {
      code: "14",
      name: "Sogn og Fjordane",
    },
    "NO-0-16": {
      code: "16",
      name: "Sør-Trøndelag",
    },
    "NO-0-8": {
      code: "8",
      name: "Telemark",
    },
    "NO-0-19": {
      code: "19",
      name: "Troms",
    },
    "NO-0-10": {
      code: "10",
      name: "Vest-Agder",
    },
    "NO-0-7": {
      code: "7",
      name: "Vestfold",
    },
    "NO-0-1": {
      code: "1",
      name: "Østfold",
    },
    "NO-0-22": {
      code: "22",
      name: "Jan Mayen",
    },
    "NO-0-21": {
      code: "21",
      name: "Svalbard",
    },
  },
  [Country.NL]: {
    "NL-0-DR": {
      code: "DR",
      name: "Drenthe",
    },
    "NL-0-FL": {
      code: "FL",
      name: "Flevoland",
    },
    "NL-0-FR": {
      code: "FR",
      name: "Fryslân",
    },
    "NL-0-GE": {
      code: "GE",
      name: "Gelderland",
    },
    "NL-0-GR": {
      code: "GR",
      name: "Groningen",
    },
    "NL-0-LI": {
      code: "LI",
      name: "Limburg",
    },
    "NL-0-NB": {
      code: "NB",
      name: "Noord-Brabant",
    },
    "NL-0-NH": {
      code: "NH",
      name: "Noord-Holland",
    },
    "NL-0-OV": {
      code: "OV",
      name: "Overijssel",
    },
    "NL-0-UT": {
      code: "UT",
      name: "Utrecht",
    },
    "NL-0-ZE": {
      code: "ZE",
      name: "Zeeland",
    },
    "NL-0-ZH": {
      code: "ZH",
      name: "Zuid-Holland",
    },
  },
  [Country.PT]: {
    "PT-0-1": {
      code: "1",
      name: "Aveiro",
    },
    "PT-0-2": {
      code: "2",
      name: "Beja",
    },
    "PT-0-3": {
      code: "3",
      name: "Braga",
    },
    "PT-0-4": {
      code: "4",
      name: "Bragança",
    },
    "PT-0-5": {
      code: "5",
      name: "Castelo Branco",
    },
    "PT-0-6": {
      code: "6",
      name: "Coimbra",
    },
    "PT-0-7": {
      code: "7",
      name: "Évora",
    },
    "PT-0-8": {
      code: "8",
      name: "Faro",
    },
    "PT-0-9": {
      code: "9",
      name: "Guarda",
    },
    "PT-0-10": {
      code: "10",
      name: "Leiria",
    },
    "PT-0-11": {
      code: "11",
      name: "Lisboa",
    },
    "PT-0-12": {
      code: "12",
      name: "Portalegre",
    },
    "PT-0-13": {
      code: "13",
      name: "Porto",
    },
    "PT-0-14": {
      code: "14",
      name: "Santarém",
    },
    "PT-0-15": {
      code: "15",
      name: "Setúbal",
    },
    "PT-0-16": {
      code: "16",
      name: "Viana do Castelo",
    },
    "PT-0-17": {
      code: "17",
      name: "Vila Real",
    },
    "PT-0-18": {
      code: "18",
      name: "Viseu",
    },
    "PT-0-20": {
      code: "20",
      name: "Região Autónoma dos Açores",
    },
    "PT-0-30": {
      code: "30",
      name: "Região Autónoma da Madeira",
    },
  },
};
export const GeographicStatesLevel1: {
  [localeFormat in Country]?: GeographicStateMap;
} = {
  [Country.AR]: {
    "AR-1-C": {
      code: "C",
      name: "Ciudad Autónoma de Buenos Aires",
    },
    "AR-1-B": {
      code: "B",
      name: "Buenos Aires",
    },
    "AR-1-K": {
      code: "K",
      name: "Catamarca",
    },
    "AR-1-H": {
      code: "H",
      name: "Chaco",
    },
    "AR-1-U": {
      code: "U",
      name: "Chubut",
    },
    "AR-1-X": {
      code: "X",
      name: "Córdoba",
    },
    "AR-1-W": {
      code: "W",
      name: "Corrientes",
    },
    "AR-1-E": {
      code: "E",
      name: "Entre Ríos",
    },
    "AR-1-P": {
      code: "P",
      name: "Formosa",
    },
    "AR-1-Y": {
      code: "Y",
      name: "Jujuy",
    },
    "AR-1-L": {
      code: "L",
      name: "La Pampa",
    },
    "AR-1-F": {
      code: "F",
      name: "La Rioja",
    },
    "AR-1-M": {
      code: "M",
      name: "Mendoza",
    },
    "AR-1-N": {
      code: "N",
      name: "Misiones",
    },
    "AR-1-Q": {
      code: "Q",
      name: "Neuquén",
    },
    "AR-1-R": {
      code: "R",
      name: "Río Negro",
    },
    "AR-1-A": {
      code: "A",
      name: "Salta",
    },
    "AR-1-J": {
      code: "J",
      name: "San Juan",
    },
    "AR-1-D": {
      code: "D",
      name: "San Luis",
    },
    "AR-1-Z": {
      code: "Z",
      name: "Santa Cruz",
    },
    "AR-1-S": {
      code: "S",
      name: "Santa Fe",
    },
    "AR-1-G": {
      code: "G",
      name: "Santiago del Estero",
    },
    "AR-1-V": {
      code: "V",
      name: "Tierra del Fuego",
    },
    "AR-1-T": {
      code: "T",
      name: "Tucumán",
    },
  },
  [Country.FR]: {
    "FR-1-01": {
      code: "01",
      name: "Ain",
    },
    "FR-1-02": {
      code: "02",
      name: "Aisne",
    },
    "FR-1-03": {
      code: "03",
      name: "Allier",
    },
    "FR-1-04": {
      code: "04",
      name: "Alpes (Hte-Provence)",
    },
    "FR-1-05": {
      code: "05",
      name: "Hautes Alpes",
    },
    "FR-1-06": {
      code: "06",
      name: "Alpes-Maritimes",
    },
    "FR-1-07": {
      code: "07",
      name: "Ardeche",
    },
    "FR-1-08": {
      code: "08",
      name: "Ardennes",
    },
    "FR-1-09": {
      code: "09",
      name: "Ariege",
    },
    "FR-1-10": {
      code: "10",
      name: "Aube",
    },
    "FR-1-11": {
      code: "11",
      name: "Aude",
    },
    "FR-1-12": {
      code: "12",
      name: "Aveyron",
    },
    "FR-1-67": {
      code: "67",
      name: "Bas-Rhin",
    },
    "FR-1-13": {
      code: "13",
      name: "Bouches-du-Rhone",
    },
    "FR-1-14": {
      code: "14",
      name: "Calvados",
    },
    "FR-1-15": {
      code: "15",
      name: "Cantal",
    },
    "FR-1-16": {
      code: "16",
      name: "Charente",
    },
    "FR-1-17": {
      code: "17",
      name: "Charente-Maritime",
    },
    "FR-1-18": {
      code: "18",
      name: "Cher",
    },
    "FR-1-19": {
      code: "19",
      name: "Correze",
    },
    "FR-1-97": {
      code: "97",
      name: "Corse-du-Nord",
    },
    "FR-1-20": {
      code: "20",
      name: "Corse-du-Sud",
    },
    "FR-1-21": {
      code: "21",
      name: "Cote-d'Or",
    },
    "FR-1-22": {
      code: "22",
      name: "Cotes-d'Armor",
    },
    "FR-1-23": {
      code: "23",
      name: "Creuse",
    },
    "FR-1-96": {
      code: "96",
      name: "D.O.M. T.O.M",
    },
    "FR-1-24": {
      code: "24",
      name: "Dordogne",
    },
    "FR-1-25": {
      code: "25",
      name: "Doubs",
    },
    "FR-1-26": {
      code: "26",
      name: "Drome",
    },
    "FR-1-91": {
      code: "91",
      name: "Essonne",
    },
    "FR-1-27": {
      code: "27",
      name: "Eure",
    },
    "FR-1-28": {
      code: "28",
      name: "Eure-et-Loir",
    },
    "FR-1-29": {
      code: "29",
      name: "Finistère",
    },
    "FR-1-30": {
      code: "30",
      name: "Gard",
    },
    "FR-1-31": {
      code: "31",
      name: "Haute Garonne",
    },
    "FR-1-32": {
      code: "32",
      name: "Gers",
    },
    "FR-1-33": {
      code: "33",
      name: "Gironde",
    },
    "FR-1-99": {
      code: "99",
      name: "Guyane",
    },
    "FR-1-100": {
      code: "100",
      name: "Haute-Corse",
    },
    "FR-1-68": {
      code: "68",
      name: "Haut-Rhin",
    },
    "FR-1-92": {
      code: "92",
      name: "Hauts-de-Seine",
    },
    "FR-1-34": {
      code: "34",
      name: "Herault",
    },
    "FR-1-35": {
      code: "35",
      name: "Ille-et-Vilaine",
    },
    "FR-1-36": {
      code: "36",
      name: "Indre",
    },
    "FR-1-37": {
      code: "37",
      name: "Indre-et-Loire",
    },
    "FR-1-38": {
      code: "38",
      name: "Isere",
    },
    "FR-1-39": {
      code: "39",
      name: "Jura",
    },
    "FR-1-40": {
      code: "40",
      name: "Landes",
    },
    "FR-1-41": {
      code: "41",
      name: "Loir-et-Cher",
    },
    "FR-1-42": {
      code: "42",
      name: "Loire",
    },
    "FR-1-43": {
      code: "43",
      name: "Haute Loire",
    },
    "FR-1-44": {
      code: "44",
      name: "Loire-Atlantique",
    },
    "FR-1-45": {
      code: "45",
      name: "Loiret",
    },
    "FR-1-46": {
      code: "46",
      name: "Lot",
    },
    "FR-1-47": {
      code: "47",
      name: "Lot-et-Garonne",
    },
    "FR-1-48": {
      code: "48",
      name: "Lozere",
    },
    "FR-1-49": {
      code: "49",
      name: "Maine-et-Loire",
    },
    "FR-1-50": {
      code: "50",
      name: "Manche",
    },
    "FR-1-51": {
      code: "51",
      name: "Marne",
    },
    "FR-1-52": {
      code: "52",
      name: "Haute Marne",
    },
    "FR-1-53": {
      code: "53",
      name: "Mayenne",
    },
    "FR-1-54": {
      code: "54",
      name: "Meurthe-et-Moselle",
    },
    "FR-1-55": {
      code: "55",
      name: "Meuse",
    },
    "FR-1-56": {
      code: "56",
      name: "Morbihan",
    },
    "FR-1-57": {
      code: "57",
      name: "Moselle",
    },
    "FR-1-58": {
      code: "58",
      name: "Nievre",
    },
    "FR-1-59": {
      code: "59",
      name: "Nord",
    },
    "FR-1-60": {
      code: "60",
      name: "Oise",
    },
    "FR-1-61": {
      code: "61",
      name: "Orne",
    },
    "FR-1-75": {
      code: "75",
      name: "Paris",
    },
    "FR-1-62": {
      code: "62",
      name: "Pas-de-Calais",
    },
    "FR-1-63": {
      code: "63",
      name: "Puy-de-Dôme",
    },
    "FR-1-65": {
      code: "65",
      name: "Hautes Pyrenees",
    },
    "FR-1-64": {
      code: "64",
      name: "Pyrenees-Atlantiques",
    },
    "FR-1-66": {
      code: "66",
      name: "Pyrenees-Orientales",
    },
    "FR-1-69": {
      code: "69",
      name: "Rhone",
    },
    "FR-1-103": {
      code: "103",
      name: "Réunion",
    },
    "FR-1-70": {
      code: "70",
      name: "Haute Saone",
    },
    "FR-1-71": {
      code: "71",
      name: "Saone-et-Loire",
    },
    "FR-1-72": {
      code: "72",
      name: "Sarthe",
    },
    "FR-1-73": {
      code: "73",
      name: "Savoie",
    },
    "FR-1-74": {
      code: "74",
      name: "Haute Savoie",
    },
    "FR-1-76": {
      code: "76",
      name: "Seine-Maritime",
    },
    "FR-1-93": {
      code: "93",
      name: "Seine-Saint-Denis",
    },
    "FR-1-77": {
      code: "77",
      name: "Seine-et-Marne",
    },
    "FR-1-79": {
      code: "79",
      name: "Deux Sevres",
    },
    "FR-1-80": {
      code: "80",
      name: "Somme",
    },
    "FR-1-81": {
      code: "81",
      name: "Tarn",
    },
    "FR-1-82": {
      code: "82",
      name: "Tarn-et-Garonne",
    },
    "FR-1-90": {
      code: "90",
      name: "Territoire-de-Belfort",
    },
    "FR-1-95": {
      code: "95",
      name: "Val-d'Oise",
    },
    "FR-1-94": {
      code: "94",
      name: "Val-de-Marne",
    },
    "FR-1-83": {
      code: "83",
      name: "Var",
    },
    "FR-1-84": {
      code: "84",
      name: "Vaucluse",
    },
    "FR-1-85": {
      code: "85",
      name: "Vendee",
    },
    "FR-1-86": {
      code: "86",
      name: "Vienne",
    },
    "FR-1-87": {
      code: "87",
      name: "Haute Vienne",
    },
    "FR-1-88": {
      code: "88",
      name: "Vosges",
    },
    "FR-1-89": {
      code: "89",
      name: "Yonne",
    },
    "FR-1-78": {
      code: "78",
      name: "Yvelines",
    },
  },
  [Country.ES]: {
    "ES-1-C": {
      code: "C",
      name: "A Coruña",
    },
    "ES-1-VI": {
      code: "VI",
      name: "Álava",
    },
    "ES-1-AB": {
      code: "AB",
      name: "Albacete",
    },
    "ES-1-A": {
      code: "A",
      name: "Alicante",
    },
    "ES-1-AL": {
      code: "AL",
      name: "Almería",
    },
    "ES-1-O": {
      code: "O",
      name: "Asturias",
    },
    "ES-1-AV": {
      code: "AV",
      name: "Ávila",
    },
    "ES-1-BA": {
      code: "BA",
      name: "Badajoz",
    },
    "ES-1-PM": {
      code: "PM",
      name: "Illes Balears",
    },
    "ES-1-B": {
      code: "B",
      name: "Barcelona",
    },
    "ES-1-BU": {
      code: "BU",
      name: "Burgos",
    },
    "ES-1-CC": {
      code: "CC",
      name: "Cáceres",
    },
    "ES-1-CA": {
      code: "CA",
      name: "Cádiz",
    },
    "ES-1-S": {
      code: "S",
      name: "Cantabria",
    },
    "ES-1-CS": {
      code: "CS",
      name: "Castellón",
    },
    "ES-1-CR": {
      code: "CR",
      name: "Ciudad Real",
    },
    "ES-1-CO": {
      code: "CO",
      name: "Córdoba",
    },
    "ES-1-CU": {
      code: "CU",
      name: "Cuenca",
    },
    "ES-1-GI": {
      code: "GI",
      name: "Girona",
    },
    "ES-1-GR": {
      code: "GR",
      name: "Granada",
    },
    "ES-1-GU": {
      code: "GU",
      name: "Guadalajara",
    },
    "ES-1-SS": {
      code: "SS",
      name: "Gipuzkoa",
    },
    "ES-1-H": {
      code: "H",
      name: "Huelva",
    },
    "ES-1-HU": {
      code: "HU",
      name: "Huesca",
    },
    "ES-1-J": {
      code: "J",
      name: "Jaén",
    },
    "ES-1-LO": {
      code: "LO",
      name: "La Rioja",
    },
    "ES-1-GC": {
      code: "GC",
      name: "Las Palmas",
    },
    "ES-1-LE": {
      code: "LE",
      name: "León",
    },
    "ES-1-L": {
      code: "L",
      name: "Lleida",
    },
    "ES-1-LU": {
      code: "LU",
      name: "Lugo",
    },
    "ES-1-M": {
      code: "M",
      name: "Madrid",
    },
    "ES-1-MA": {
      code: "MA",
      name: "Málaga",
    },
    "ES-1-MU": {
      code: "MU",
      name: "Murcia",
    },
    "ES-1-NA": {
      code: "NA",
      name: "Navarra",
    },
    "ES-1-OR": {
      code: "OR",
      name: "Ourense",
    },
    "ES-1-P": {
      code: "P",
      name: "Palencia",
    },
    "ES-1-PO": {
      code: "PO",
      name: "Pontevedra",
    },
    "ES-1-SA": {
      code: "SA",
      name: "Salamanca",
    },
    "ES-1-TF": {
      code: "TF",
      name: "Santa Cruz de Tenerife",
    },
    "ES-1-SG": {
      code: "SG",
      name: "Segovia",
    },
    "ES-1-SE": {
      code: "SE",
      name: "Sevilla",
    },
    "ES-1-SO": {
      code: "SO",
      name: "Soria",
    },
    "ES-1-T": {
      code: "T",
      name: "Tarragona",
    },
    "ES-1-TE": {
      code: "TE",
      name: "Teruel",
    },
    "ES-1-TO": {
      code: "TO",
      name: "Toledo",
    },
    "ES-1-V": {
      code: "V",
      name: "Valencia",
    },
    "ES-1-VA": {
      code: "VA",
      name: "Valladolid",
    },
    "ES-1-BI": {
      code: "BI",
      name: "Bizkaia",
    },
    "ES-1-ZA": {
      code: "ZA",
      name: "Zamora",
    },
    "ES-1-Z": {
      code: "Z",
      name: "Zaragoza",
    },
  },
  [Country.IT]: {
    "IT-1-AG": {
      code: "AG",
      name: "Agrigento",
    },
    "IT-1-AL": {
      code: "AL",
      name: "Alessandria",
    },
    "IT-1-AN": {
      code: "AN",
      name: "Ancona",
    },
    "IT-1-AO": {
      code: "AO",
      name: "Aosta",
    },
    "IT-1-AR": {
      code: "AR",
      name: "Arezzo",
    },
    "IT-1-AP": {
      code: "AP",
      name: "Ascoli Piceno",
    },
    "IT-1-AT": {
      code: "AT",
      name: "Asti",
    },
    "IT-1-AV": {
      code: "AV",
      name: "Avellino",
    },
    "IT-1-BA": {
      code: "BA",
      name: "Bari",
    },
    "IT-1-BT": {
      code: "BT",
      name: "Barletta-Andria-Trani",
    },
    "IT-1-BL": {
      code: "BL",
      name: "Belluno",
    },
    "IT-1-BN": {
      code: "BN",
      name: "Benevento",
    },
    "IT-1-BG": {
      code: "BG",
      name: "Bergamo",
    },
    "IT-1-BI": {
      code: "BI",
      name: "Biella",
    },
    "IT-1-BO": {
      code: "BO",
      name: "Bologna",
    },
    "IT-1-BZ": {
      code: "BZ",
      name: "Bolzano",
    },
    "IT-1-BS": {
      code: "BS",
      name: "Brescia",
    },
    "IT-1-BR": {
      code: "BR",
      name: "Brindisi",
    },
    "IT-1-CA": {
      code: "CA",
      name: "Cagliari",
    },
    "IT-1-CL": {
      code: "CL",
      name: "Caltanissetta",
    },
    "IT-1-CB": {
      code: "CB",
      name: "Campobasso",
    },
    "IT-1-CI": {
      code: "CI",
      name: "Carbonia-Iglesias",
    },
    "IT-1-CE": {
      code: "CE",
      name: "Caserta",
    },
    "IT-1-CT": {
      code: "CT",
      name: "Catania",
    },
    "IT-1-CZ": {
      code: "CZ",
      name: "Catanzaro",
    },
    "IT-1-CH": {
      code: "CH",
      name: "Chieti",
    },
    "IT-1-CO": {
      code: "CO",
      name: "Como",
    },
    "IT-1-CS": {
      code: "CS",
      name: "Cosenza",
    },
    "IT-1-CR": {
      code: "CR",
      name: "Cremona",
    },
    "IT-1-KR": {
      code: "KR",
      name: "Crotone",
    },
    "IT-1-CN": {
      code: "CN",
      name: "Cuneo",
    },
    "IT-1-EN": {
      code: "EN",
      name: "Enna",
    },
    "IT-1-FM": {
      code: "FM",
      name: "Fermo",
    },
    "IT-1-FE": {
      code: "FE",
      name: "Ferrara",
    },
    "IT-1-FI": {
      code: "FI",
      name: "Firenze",
    },
    "IT-1-FG": {
      code: "FG",
      name: "Foggia",
    },
    "IT-1-FC": {
      code: "FC",
      name: "Forlì-Cesena",
    },
    "IT-1-FR": {
      code: "FR",
      name: "Frosinone",
    },
    "IT-1-GE": {
      code: "GE",
      name: "Genova",
    },
    "IT-1-GO": {
      code: "GO",
      name: "Gorizia",
    },
    "IT-1-GR": {
      code: "GR",
      name: "Grosseto",
    },
    "IT-1-IM": {
      code: "IM",
      name: "Imperia",
    },
    "IT-1-IS": {
      code: "IS",
      name: "Isernia",
    },
    "IT-1-SP": {
      code: "SP",
      name: "La Spezia",
    },
    "IT-1-AQ": {
      code: "AQ",
      name: "L'Aquila",
    },
    "IT-1-LT": {
      code: "LT",
      name: "Latina",
    },
    "IT-1-LE": {
      code: "LE",
      name: "Lecce",
    },
    "IT-1-LC": {
      code: "LC",
      name: "Lecco",
    },
    "IT-1-LI": {
      code: "LI",
      name: "Livorno",
    },
    "IT-1-LO": {
      code: "LO",
      name: "Lodi",
    },
    "IT-1-LU": {
      code: "LU",
      name: "Lucca",
    },
    "IT-1-MC": {
      code: "MC",
      name: "Macerata",
    },
    "IT-1-MN": {
      code: "MN",
      name: "Mantova",
    },
    "IT-1-MS": {
      code: "MS",
      name: "Massa-Carrara",
    },
    "IT-1-MT": {
      code: "MT",
      name: "Matera",
    },
    "IT-1-VS": {
      code: "VS",
      name: "Medio Campidano",
    },
    "IT-1-ME": {
      code: "ME",
      name: "Messina",
    },
    "IT-1-MI": {
      code: "MI",
      name: "Milano",
    },
    "IT-1-MO": {
      code: "MO",
      name: "Modena",
    },
    "IT-1-MB": {
      code: "MB",
      name: "Monza e Brianza",
    },
    "IT-1-NA": {
      code: "NA",
      name: "Napoli",
    },
    "IT-1-NO": {
      code: "NO",
      name: "Novara",
    },
    "IT-1-NU": {
      code: "NU",
      name: "Nuoro",
    },
    "IT-1-OG": {
      code: "OG",
      name: "Ogliastra",
    },
    "IT-1-OT": {
      code: "OT",
      name: "Olbia-Tempio",
    },
    "IT-1-OR": {
      code: "OR",
      name: "Oristano",
    },
    "IT-1-PD": {
      code: "PD",
      name: "Padova",
    },
    "IT-1-PA": {
      code: "PA",
      name: "Palermo",
    },
    "IT-1-PR": {
      code: "PR",
      name: "Parma",
    },
    "IT-1-PV": {
      code: "PV",
      name: "Pavia",
    },
    "IT-1-PG": {
      code: "PG",
      name: "Perugia",
    },
    "IT-1-PU": {
      code: "PU",
      name: "Pesaro e Urbino",
    },
    "IT-1-PE": {
      code: "PE",
      name: "Pescara",
    },
    "IT-1-PC": {
      code: "PC",
      name: "Piacenza",
    },
    "IT-1-PI": {
      code: "PI",
      name: "Pisa",
    },
    "IT-1-PT": {
      code: "PT",
      name: "Pistoia",
    },
    "IT-1-PN": {
      code: "PN",
      name: "Pordenone",
    },
    "IT-1-PZ": {
      code: "PZ",
      name: "Potenza",
    },
    "IT-1-PO": {
      code: "PO",
      name: "Prato",
    },
    "IT-1-RG": {
      code: "RG",
      name: "Ragusa",
    },
    "IT-1-RA": {
      code: "RA",
      name: "Ravenna",
    },
    "IT-1-RC": {
      code: "RC",
      name: "Reggio Calabria",
    },
    "IT-1-RE": {
      code: "RE",
      name: "Reggio Emilia",
    },
    "IT-1-RI": {
      code: "RI",
      name: "Rieti",
    },
    "IT-1-RN": {
      code: "RN",
      name: "Rimini",
    },
    "IT-1-RM": {
      code: "RM",
      name: "Roma",
    },
    "IT-1-RO": {
      code: "RO",
      name: "Rovigo",
    },
    "IT-1-SA": {
      code: "SA",
      name: "Salerno",
    },
    "IT-1-SS": {
      code: "SS",
      name: "Sassari",
    },
    "IT-1-SV": {
      code: "SV",
      name: "Savona",
    },
    "IT-1-SI": {
      code: "SI",
      name: "Siena",
    },
    "IT-1-SR": {
      code: "SR",
      name: "Siracusa",
    },
    "IT-1-SO": {
      code: "SO",
      name: "Sondrio",
    },
    "IT-1-TA": {
      code: "TA",
      name: "Taranto",
    },
    "IT-1-TE": {
      code: "TE",
      name: "Teramo",
    },
    "IT-1-TR": {
      code: "TR",
      name: "Terni",
    },
    "IT-1-TO": {
      code: "TO",
      name: "Torino",
    },
    "IT-1-TP": {
      code: "TP",
      name: "Trapani",
    },
    "IT-1-TN": {
      code: "TN",
      name: "Trento",
    },
    "IT-1-TV": {
      code: "TV",
      name: "Treviso",
    },
    "IT-1-TS": {
      code: "TS",
      name: "Trieste",
    },
    "IT-1-UD": {
      code: "UD",
      name: "Udine",
    },
    "IT-1-VA": {
      code: "VA",
      name: "Varese",
    },
    "IT-1-VE": {
      code: "VE",
      name: "Venezia",
    },
    "IT-1-VB": {
      code: "VB",
      name: "Verbano-Cusio-Ossola",
    },
    "IT-1-VC": {
      code: "VC",
      name: "Vercelli",
    },
    "IT-1-VR": {
      code: "VR",
      name: "Verona",
    },
    "IT-1-VV": {
      code: "VV",
      name: "Vibo Valentia",
    },
    "IT-1-VI": {
      code: "VI",
      name: "Vicenza",
    },
    "IT-1-VT": {
      code: "VT",
      name: "Viterbo",
    },
  },
  [Country.BE]: {
    "BE-1-VAN": {
      code: "VAN",
      name: "Antwerpen",
    },
    "BE-1-WBR": {
      code: "WBR",
      name: "Brabant wallon",
    },
    "BE-1-WHT": {
      code: "WHT",
      name: "Hainaut",
    },
    "BE-1-WLG": {
      code: "WLG",
      name: "Liège",
    },
    "BE-1-VLI": {
      code: "VLI",
      name: "Limburg",
    },
    "BE-1-WLX": {
      code: "WLX",
      name: "Luxembourg",
    },
    "BE-1-WNA": {
      code: "WNA",
      name: "Namur",
    },
    "BE-1-VOV": {
      code: "VOV",
      name: "Oost-Vlaanderen",
    },
    "BE-1-VBR": {
      code: "VBR",
      name: "Vlaams-Brabant",
    },
    "BE-1-VWV": {
      code: "VWV",
      name: "West-Vlaanderen",
    },
  },
};

import re
import json
import geopandas as gpd
from shapely.geometry import Point

# load land polygons
land = gpd.read_file("ne_110m_land.shp")
land_union = land.unary_union

# read JS file
with open("AcidWatch-3D-test/src/data/ph_historical.js", "r") as f:
    content = f.read()

# extract the object
prefix = "export const phHistoricalData = "
obj_str = content[len(prefix):].strip()

# remove trailing semicolon
if obj_str.endswith(";"):
    obj_str = obj_str[:-1]

# parse JSON
data = json.loads(obj_str)

# function to check if coordinate is land
def is_land(lat, lng):
    point = Point(lng, lat)
    return land_union.contains(point)

# iterate keys
keys_to_remove = []

for key in data:
    lat, lng = map(float, key.split(","))

    if is_land(lat, lng):
        keys_to_remove.append(key)

# delete keys
for key in keys_to_remove:
    del data[key]

# write cleaned file
with open("AcidWatch-3D-test/src/data/ph_historical.js", "w") as f:
    f.write("export const phHistoricalData = ")
    json.dump(data, f, indent=2)
    f.write(";")

print(f"Removed {len(keys_to_remove)} land points.")
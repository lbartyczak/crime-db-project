import pandas

df = pandas.read_csv("Crimes_-_2001_to_Present.csv")

df = df[df['Year'] >= 2014]

df = df.drop(['Beat', 'Ward', 'Community Area', 'Domestic', 'Updated On', 'Latitude', 'Longitude', 'Location'], axis=1)

df = df.reset_index(drop=True)

print(df.head())
print(df.tail())

print("writing...")

df.to_csv('crime.csv', index=False)

import pandas

df = pandas.read_csv("Arrests.csv")
df = df[['CB_NO','CASE NUMBER','ARREST DATE','RACE','CHARGE 1 STATUTE','CHARGE 1 DESCRIPTION','CHARGE 1 TYPE','CHARGE 1 CLASS']]

arr = []
count = 0

for i in df['ARREST DATE']:
    if int(i[6:10]) < 2014:
        arr.append(count)
    
    count += 1

df = df.drop(arr)

df.to_csv('arrestts.csv', index = False)
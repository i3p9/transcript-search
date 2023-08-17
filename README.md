Cycle

# step 0

- Gather all subs into a folder for a series, rename the folder to `seriesname`, which will be our series_key throughtout our app
- this key will be in migration scripts, databases and frontend
- put the folder in the migration folder with SxxExx naming

# step 1 - the Data

- run `rename.py` -- it will convert all subtitles into a parseable SxxExx.txt format

- open `.env` file, put the folder name and the series key in their respective field

- run `main.py` -- it will parse the subtitle files and put everything in a mongo db collection

  - in here, the table name will be the global `seriesname`
  - you can use the DRY_RUN flag to make sure there's no encoding error, if there are it will report the filenames with such errors
  - fix the errors manually, i used coteditor. todo: write scripts to fix it, or handling parsing encodings other than utf-8

- run `tvdb.py` -- it will parse all files and gather the tv episode info (episode name, synopsis tvdb id etc)

  - the output json file should be renamed to global series name.json -> `seriesname_json.json`

- run `subs_to.json.py` -- it will parse all subtitle and create a json file for the frontend to show the subtitle
  - it will create a folder called `seriesname_json` in the migration folder
  - Put all the output json files to public/json/`seriesname`/ in the frontend folder

# step 2 - backend

can be done in two ways, a python fastapi instance, or a serverless cf worker or aws lambda instance

python server

- will be written later

serverless

- will be written later

# step 3 - frontend

- will be written later

notes: Global series name: will be used as db table, url and showName

## Meta

b99 - HI
office - HI
sunny - NONHI

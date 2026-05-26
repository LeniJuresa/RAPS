Postavljanje projekta

1. Kreiranje datoteke na desktopu
  otvaranje u VS code
  CTRL + J

2. git clone https://github.com/LeniJuresa/RAPS.git

3. py -m venv venv
4. čekaj
5. otvori novi terminal (na početku treba pisati (venv) ____)
6. Set-ExecutionPolicy -Scope Process - ExecutionPolicy Bypass
7. venv\Scripts\activate
8. cd RAPS
9. py -m pip install flask
10. py -m pip install requests
11. py -m flask --app server.py run

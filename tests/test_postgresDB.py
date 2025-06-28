import psycopg2

def test_psycopg2_direct():
    conn = psycopg2.connect(
        dbname="chatdb",
        user="chatuser",
        password="chatpass",
        host="localhost",
        port=5432
    )
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    assert cur.fetchone()[0] == 1
    cur.close()
    conn.close()
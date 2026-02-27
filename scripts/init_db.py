import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.database import init_db

if __name__ == '__main__':
    os.makedirs('data', exist_ok=True)
    init_db()
    print("Database initialized.")
import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

def handler(event: dict, context) -> dict:
    """Возвращает список компонентов с фильтрацией по категории, бренду и поиску."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    params = event.get('queryStringParameters') or {}
    category = params.get('category')
    brand = params.get('brand')
    search = params.get('search', '').strip()
    limit = int(params.get('limit', 50))
    offset = int(params.get('offset', 0))

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    where_parts = []
    args = []

    if category:
        where_parts.append("category = %s")
        args.append(category)
    if brand:
        where_parts.append("brand = %s")
        args.append(brand)
    if search:
        where_parts.append("(name ILIKE %s OR brand ILIKE %s)")
        args.extend([f'%{search}%', f'%{search}%'])

    where_sql = ('WHERE ' + ' AND '.join(where_parts)) if where_parts else ''

    cur.execute(f"SELECT id, category, brand, name, price, image_url, specs FROM components {where_sql} ORDER BY category, brand, name LIMIT %s OFFSET %s", args + [limit, offset])
    rows = cur.fetchall()

    cur.execute(f"SELECT COUNT(*) as total FROM components {where_sql}", args)
    total = cur.fetchone()['total']

    cur.execute("SELECT DISTINCT brand FROM components ORDER BY brand")
    brands = [r['brand'] for r in cur.fetchall()]

    conn.close()

    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'items': [dict(r) for r in rows], 'total': total, 'brands': brands})
    }

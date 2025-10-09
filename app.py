from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///secondlife.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Database Models
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float)
    image = db.Column(db.String(100))
    type = db.Column(db.String(20))  # 'new', 'used', 'rental'
    rental_period = db.Column(db.String(20))
    available = db.Column(db.Boolean, default=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    order_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(20), default='pending')  # 'pending', 'completed', 'cancelled'
    is_rental = db.Column(db.Boolean, default=False)
    rental_start = db.Column(db.Date)
    rental_end = db.Column(db.Date)

# Routes
@app.route('/')
def home():
    products = Product.query.filter_by(available=True).all()
    return render_template('index.html', products=products)

@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(available=True).all()
    return jsonify([{
        'id': p.id,
        'title': p.title,
        'price': p.price,
        'original_price': p.original_price,
        'image': p.image,
        'type': p.type,
        'rental_period': p.rental_period,
        'description': p.description
    } for p in products])

@app.route('/api/sell', methods=['POST'])
def sell_item():
    data = request.json
    # Validate data
    # Create new product entry
    # Return response
    return jsonify({'status': 'success', 'message': 'Your item has been submitted for review'})

@app.route('/api/rent', methods=['POST'])
def rent_item():
    data = request.json
    # Process rental request
    # Update product availability
    # Create order
    return jsonify({'status': 'success', 'message': 'Rental confirmed'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
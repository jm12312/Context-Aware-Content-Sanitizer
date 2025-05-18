from flask import request, jsonify, Blueprint
import easyocr
import tempfile
import os
task1_bp = Blueprint("task1_bp", __name__)
reader = easyocr.Reader(['en'])

def apply_ocr(image_path):
    result = reader.readtext(image_path)
    extracted_text = " ".join([res[1] for res in result])
    return extracted_text

@task1_bp.route('/ocr', methods=['POST'])
def ocr_route():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
            image_path = temp_file.name
            image_file.save(image_path)

        extracted_text = apply_ocr(image_path)
        os.remove(image_path)

        return jsonify({'ocr_text': extracted_text})

    except Exception as e:
        return jsonify({'error': 'Server error', 'details': str(e)}), 500


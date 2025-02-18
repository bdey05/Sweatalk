from api.landing import bp 

@bp.route('/')
@bp.route('/landing')
def landing():
    return ('<h2>Landing Page</h2>')

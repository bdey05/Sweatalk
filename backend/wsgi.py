import os
from api import create_app, ConfigProduction

app = create_app(ConfigProduction)
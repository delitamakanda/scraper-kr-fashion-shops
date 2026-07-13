import requests
from django.conf import settings


class WeatherServices:
    @staticmethod
    def get_weather():
        url = 'https://api.openweathermap.org/data/2.5/weather?q={}&units=metric&appid=' + settings.OPENWEATHERMAP_API_KEY
        
        cities = ['Paris', 'London', 'Berlin', 'Seoul', 'Tokyo', 'Taipei', 'Kaohsiung', 'Shanghai', 'La Nouvelle-Orléans']
        
        weather_data = []
        for city in cities:
            response = requests.get(url.format(city)).json()
            weather_data.append({
                'city': city,
                'temperature': response['main']['temp'],
                'humidity': response['main']['humidity'],
                'description': response['weather'][0]['description'],
                'icon': response['weather'][0]['icon']
            })
        return weather_data
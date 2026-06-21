from core.services.weather_services import WeatherServices

class WeatherSelectors:
    @staticmethod
    def get_weather():
        return WeatherServices.get_weather()
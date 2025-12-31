export interface WeatherData {
    latitude: number;
    longitude: number;
    current: {
        time: string;
        temperature2m: number;
        relativeHumidity2m: number;
        apparentTemperature: number;
        isDay: number;
        precipitation: number;
        weatherCode: number;
        windSpeed10m: number;
        uvIndex: number;
    };
    hourly: {
        time: string[];
        temperature2m: number[];
        weatherCode: number[];
        uvIndex: number[];
    };
    daily: {
        time: string[];
        weatherCode: number[];
        temperature2mMax: number[];
        temperature2mMin: number[];
        uvIndexMax: number[];
        precipitationSum: number[];
    };
}

export interface Location {
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

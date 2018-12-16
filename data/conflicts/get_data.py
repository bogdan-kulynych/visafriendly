#!/bin/env python3

import datetime
import collections

import requests


REQ_URL = "http://ucdpapi.pcr.uu.se/api/ucdpprioconflict/18.1?pagesize=1000&year={years}"
CANONICAL_COUNTRY_NAMES = {
    'Myanmar (Burma)': 'Myanmar',
    'Russia (Soviet Union)': 'Russia',
    'DR Congo (Zaire)': 'Democratic Republic of the Congo',
    'Yemen (North Yemen)': 'Yemen'
}


# Missing data points.
DATA_PATCH = {
    # Criminal violence in Mexico.
    'Mexico': 2,

    # Central African Republic conflict.
    'Central African Republic': 1,

    # Israeli-Palestinian conflict.
    'Israel': 1,
    'Palestine': 1,

    # Insurgency in the Maghreb.
    'Burkina Faso': 1,
}


ROW_FORMAT = '{};{}'


def should_drop_conflict(conflict):
    # Drop al-Qaida in the US
    if conflict['side_b'] == 'al-Qaida ' and conflict['location'] == 'United States of America':
        return True

    return False


if __name__ == '__main__':
    year = datetime.date.today().year
    years = ','.join(map(str, [year - 2, year - 1, year]))
    url = REQ_URL.format(years=years)

    res = requests.get(url)
    response = res.json()

    # Collect data.
    intensities_by_country = collections.defaultdict(list)
    for conflict in response['Result']:
        if should_drop_conflict(conflict):
            continue

        locations = conflict['location']
        countries = locations.split(',')
        for country in countries:
            if country in CANONICAL_COUNTRY_NAMES:
                country = CANONICAL_COUNTRY_NAMES[country]
            country = country.strip()
            intensities_by_country[country].append(
                    int(conflict['intensity_level']))

    # Output max intensity and country as csv.
    for country, intensities in intensities_by_country.items():
        max_intensities = max(intensities)
        if country in DATA_PATCH:
            max_intensities = DATA_PATCH[country]
        print(ROW_FORMAT.format(country, max_intensities))

    for country, intensity in DATA_PATCH.items():
        if country in intensities_by_country:
            continue
        print(ROW_FORMAT.format(country, intensity))

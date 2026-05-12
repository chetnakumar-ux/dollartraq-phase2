const DUMMY_CARRIERS = [
    {
        row_id: '1',
        name: 'ABC Moving Services Inc',
        carrier_type: 'INTERSTATE CARRIER',
        authority_status: 'ACTIVE AUTHORITY',
        mileage: 125400,
        fleet_size: 42,
        mc_number: '123456',
        dot_number: '2938475',
        ein: 'XX-XXX8901',
        duns: '01-234-5678',
        address: '123 Logistics Way, Chicago, IL 60601',
        phone: '(555) 012-3456',
        email: 'ops@abcmoving.com',
        authority_verified: true,
        insurance_current: true,
        risk_level: 'low',
    },
    {
        row_id: '2',
        name: 'Swift Freight Solutions LLC',
        carrier_type: 'INTRASTATE CARRIER',
        authority_status: 'ACTIVE AUTHORITY',
        mileage: 89300,
        fleet_size: 28,
        mc_number: '654321',
        dot_number: '1847362',
        ein: 'XX-XXX4512',
        duns: '02-345-6789',
        address: '456 Commerce Blvd, Dallas, TX 75201',
        phone: '(555) 123-4567',
        email: 'dispatch@swiftfreight.com',
        authority_verified: true,
        insurance_current: false,
        risk_level: 'medium',
    },
    {
        row_id: '3',
        name: 'Nationwide Haulers Corp',
        carrier_type: 'INTERSTATE CARRIER',
        authority_status: 'ACTIVE AUTHORITY',
        mileage: 312000,
        fleet_size: 120,
        mc_number: '789012',
        dot_number: '3756284',
        ein: 'XX-XXX7823',
        duns: '03-456-7890',
        address: '789 Highway Dr, Atlanta, GA 30301',
        phone: '(555) 234-5678',
        email: 'info@nationwidehaulers.com',
        authority_verified: true,
        insurance_current: true,
        risk_level: 'low',
    },
];

const SIMULATED_DELAY_MS = 400;

const CarrierSearchApi = {

    search: (formData, callback) => {

        setTimeout(() => {

            try {

                const query = (formData.get('query') || '').toLowerCase().trim();
                const sort_by = formData.get('sort_by') || '';

                let list = [...DUMMY_CARRIERS];

                // Search
                if (query) {

                    list = list.filter(carrier => (

                        carrier.name.toLowerCase().includes(query) ||
                        carrier.mc_number.includes(query) ||
                        carrier.dot_number.includes(query) ||
                        carrier.phone.includes(query) ||
                        carrier.email.toLowerCase().includes(query)

                    ));
                }

                // Sort
                switch (sort_by) {

                    case 'mileage_desc':
                        list.sort((a, b) => b.mileage - a.mileage);
                        break;

                    case 'mileage_asc':
                        list.sort((a, b) => a.mileage - b.mileage);
                        break;

                    case 'fleet_desc':
                        list.sort((a, b) => b.fleet_size - a.fleet_size);
                        break;

                    case 'fleet_asc':
                        list.sort((a, b) => a.fleet_size - b.fleet_size);
                        break;

                    case 'name_asc':
                        list.sort((a, b) => a.name.localeCompare(b.name));
                        break;

                    default:
                        break;
                }

                callback({
                    status: true,
                    carriers: list,
                    total: list.length,
                });

            } catch (error) {

                console.error('Carrier Search Error:', error);

                callback({
                    status: false,
                    carriers: [],
                    total: 0,
                });
            }

        }, SIMULATED_DELAY_MS);
    },

    getFilters: (callback) => {

        setTimeout(() => {

            callback({
                status: true,

                sort_options: [
                    { value: 'mileage_desc', label: 'Mileage: High to Low' },
                    { value: 'mileage_asc', label: 'Mileage: Low to High' },
                    { value: 'fleet_desc', label: 'Fleet Size: Large First' },
                    { value: 'fleet_asc', label: 'Fleet Size: Small First' },
                    { value: 'name_asc', label: 'Name: A → Z' },
                ],
            });

        }, SIMULATED_DELAY_MS);
    },
};

export default CarrierSearchApi;
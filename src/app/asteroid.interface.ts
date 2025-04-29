export interface AsteroidInterface {
    name: string;
    estimated_diameter_m: {
        min: number;
        max: number;
    };
    close_approach: {
        date_full: string;
        relative_velocity_km_s: number;
        miss_distance: {
          lunar: number;
          astronomical: number;
        };
        orbiting_body: string;
      };
}

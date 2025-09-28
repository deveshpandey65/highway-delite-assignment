export default function BurstPattern() {
    const rays = Array.from({ length: 12 });

    return (
        <div className="relative w-[32px] h-[32px]">
            {/* Radial rays */}
            {rays.map((_, i) => {
                const rotateDeg = i * (360 / rays.length);
                return (
                    <div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-[4px] h-[20px] bg-blue-500"
                        style={{
                            transform: `rotate(${rotateDeg}deg) translateY(-10px)`,
                            transformOrigin: 'center center',
                        }}
                    />
                );
            })}

            {/* Central white circle */}
            <div className="absolute top-[26px] left-[18px] w-[16px] h-[16px] bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10" />
        </div>
    );
}

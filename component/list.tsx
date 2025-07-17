"use client"

export function List() {
    const items = [
        { name: "Item 1", href: "#" },
        { name: "Item 2", href: "#" },
        { name: "Item 3", href: "#" },
        { name: "Item 4", href: "#" },
    ];

    return (
        <div className="container mx-auto px-6 py-8">
            <ul className="space-y-4">
                {items.map((item) => (
                    <li key={item.name} className="bg-gray-100 p-4 rounded shadow hover:bg-gray-200 transition-colors">
                        <a href={item.href} className="text-lg text-blue-600 hover:underline">
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
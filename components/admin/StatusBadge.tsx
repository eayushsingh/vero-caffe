import { cn } from "@/lib/utils";

interface Props {
    status: string;
}

export default function StatusBadge({ status }: Props) {

    const getStyle = (s: string) => {
        switch (s) {
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "ready": return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            getStyle(status)
        )}>
            {status}
        </span>
    );
}

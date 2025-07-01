

type Props = {
    onClickFn: (id: number) => void,
    id: number
}

export function Xis({onClickFn, id}: Props){
    return (
        <div onClick={() => onClickFn(id)} className="relative rounded-sm w-5 h-5 flex justify-center items-center cursor-pointer">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 rounded-full rotate-45"></div>
            <div className=" absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 rounded-full -rotate-45"></div>
        </div>
    )
}
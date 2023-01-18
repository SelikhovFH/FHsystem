import {FC} from 'react';

type Props = {
    size: number;
    horizontal?: boolean;
    inline?: boolean;
};

export const Gutter: FC<Props> = ({horizontal, size, inline}) => {
    return (
        <div
            style={{
                ...(horizontal ? {width: size * 8} : {height: size * 8}),
                ...(inline ? {display: 'inline-block'} : {}),
            }}
        >
            {' '}
        </div>
    );
};

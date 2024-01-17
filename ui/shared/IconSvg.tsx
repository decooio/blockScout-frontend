import type { HTMLChakraProps } from '@chakra-ui/react';
import { Skeleton, chakra } from '@chakra-ui/react';
import { type IconName } from 'public/icons/name';
import React from 'react';

export const href = '/icons/sprite.svg';

export { IconName };
/* eslint-disable*/
interface Props extends HTMLChakraProps<"div"> {
  name: any | IconName;
  isLoading?: boolean;
}

const IconSvg = ({ name, isLoading, ...props }: Props) => {
  return (
    <Skeleton isLoaded={!isLoading} display="inline-block" {...props}>
      <chakra.svg w="100%" h="100%">
        <use href={`${href}#${name}`} />
      </chakra.svg>
    </Skeleton>
  );
};

export default IconSvg;

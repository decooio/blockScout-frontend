import { Center, Link, Skeleton } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

/* eslint-disable */
type Props = {
  icon?: any;
  iconSize?: string;
  text?: string;
  url: string;
  isLoading?: boolean;
};

const FooterLinkItem = ({ icon, iconSize, text, url, isLoading }: Props) => {
  if (isLoading) {
    return <Skeleton my="3px">{text}</Skeleton>;
  }

  return (
    <Link
      href={url}
      display="flex"
      alignItems="center"
      h="30px"
      variant="secondary"
      target="_blank"
      fontSize="xs"
    >
      {icon && (
        <Center minW={6} mr={2}>
          {typeof icon === "string" ? (
            <IconSvg boxSize={iconSize || 5} name={icon} />
          ) : (
            icon
          )}
        </Center>
      )}
      {text}
    </Link>
  );
};

export default FooterLinkItem;

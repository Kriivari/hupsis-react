import React from "react"
import { AvatarGroup, AvatarGroupItem, AvatarGroupPopover, partitionAvatarGroupItems } from "@fluentui/react-components"

interface Props {
  names: string[]
}

export const Avatars: React.FC<Props> = ({names}) => {
  const { inlineItems, overflowItems } = partitionAvatarGroupItems({
    items: names,
  });

  return (
    <AvatarGroup layout="stack">
      {inlineItems.map((item) => (
         <AvatarGroupItem name={item} key={item} />
      ))}
      {overflowItems && (
        <AvatarGroupPopover>
          {overflowItems.map((item) => (
            <AvatarGroupItem name={item} key={item} />
          ))}
        </AvatarGroupPopover>
      )}
    </AvatarGroup>
  )
}


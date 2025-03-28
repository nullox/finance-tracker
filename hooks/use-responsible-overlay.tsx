import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../components/ui/drawer';

export function useResponsibleOverlay() {
	const isMobile = useIsMobile();

	if (isMobile) {
		return {
			ResponsibleOverlay: Drawer,
			ResponsibleOverlayContent: DrawerContent,
			ResponsibleOverlayTitle: DrawerTitle,
			ResponsibleOverlayTrigger: DrawerTrigger,
		};
	}

	return {
		ResponsibleOverlay: Popover,
		ResponsibleOverlayContent: PopoverContent,
		ResponsibleOverlayTrigger: PopoverTrigger,
		ResponsibleOverlayTitle: null,
	};
}

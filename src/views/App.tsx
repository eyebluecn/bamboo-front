import React from 'react';
import style from './app.less';

interface Props {

}

const App: React.FC<Props> = () => {

	return (
		<div className={style.app}>
			hello bamboo
		</div>
	)
};

export default App;

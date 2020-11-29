class CreateTimers < ActiveRecord::Migration[5.2]
  def change
    create_table :timers do |t|
      t.integer :user_id
      t.integer :list_id
      t.integer :minutes

      t.timestamps
    end
  end
end
